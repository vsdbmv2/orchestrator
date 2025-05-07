import { Request, Response } from "express";
import knexLocal from "knex";
import dotenv from "dotenv";
dotenv.config();

import { IVirus, IFeatureQualifier, IViralSequence } from "../@types";
import knex from "../services/database";
import axios from "axios";
import { JSDOM } from "jsdom";

import md5 from "md5";
import createStatement from "../utils/viral_model";
import ncbi_utils from "../services/ncbi_utils";
import hashMapFunctions from "../utils/hashMapFunctions";
import { getRefseqs, getSubtypes, getTaxonomyFromApi } from "../utils/getSubtypes";
import { log } from "../utils/helpers";
import knexfile from "../../knexfile";

type countSequences = {
	sequences_length: number;
};

export const getAll = async (_: Request, res: Response) => {
	const data = await knex("virus").select().orderBy("name", "ASC");

	res.send({ status: "success", data });
};

export const getById = async (req: Request, res: Response) => {
	const { id } = req.params;

	const item: IVirus = await knex("virus").select().where("id", id).first();
	const { sequences_length } = (await knex
		.withSchema(item.database_name)
		.table("sequence")
		.count("id", { as: "sequences_length" })
		.first()) as countSequences;

	const aggregated_data = { sequences_amount: sequences_length, name: item.name, refseq: item.reference_accession }; //pegar mais dados pro relatório aqui

	res.send({ status: "success", data: aggregated_data });
};

export const update = async (req: Request, res: Response) => {
	const { id } = req.params;

	const item = req.body;

	await knex("virus").where("id", id).update(item);

	res.send({ status: "success", data: { message: "Virus updated successfully." } });
};

export const cleanUpDuplicateGis = async (req: Request, res: Response) => {
	const viruses = await knex("virus").select();
	for (const virus of viruses) {
		const duplicatedGis = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.distinct<{ gi: string }[]>("gi")
			.groupBy("gi")
			.having(knex.raw("count(gi) > 1"));
		const duplicated = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.select<{ gi: string; id: number }[]>(["id", "gi"])
			.whereIn(
				"gi",
				duplicatedGis.map(({ gi }) => gi)
			);
		const hashed: { [key: string]: number[] } = {};
		duplicated.forEach(({ gi, id }) => {
			if (hashed[gi]) return hashed[gi].push(id);
			hashed[gi] = [id];
		});
		const bulkDelete: number[] = [];
		Object.keys(hashed).forEach((gi) => {
			const [_keep, ...toDelete] = hashed[gi];
			if (toDelete.length) bulkDelete.push(...toDelete);
		});
		if (!bulkDelete.length) continue;
		await knex.withSchema(virus.database_name).table("sequence").whereIn("id", bulkDelete).del();
	}
	res.send({ status: "success" });
};
export const cleanUpDuplicateSubtypeMap = async (req: Request, res: Response) => {
	const viruses = await knex("virus").select();
	for (const virus of viruses) {
		const duplicatedSubtyping = await knex
			.withSchema(virus.database_name)
			.table("subtype_reference_sequence")
			.where("is_refseq", "=", false)
			.groupBy(knex.raw("CONCAT(idsequence,'-' ,idsubtype)"))
			.having(knex.raw("count(CONCAT(idsequence,'-' ,idsubtype)) > 1"))
			.select<{ combination: string }[]>(knex.raw("CONCAT(idsequence,'-' ,idsubtype) AS combination"));
		const duplicated = await knex
			.withSchema(virus.database_name)
			.table("subtype_reference_sequence")
			.whereIn(
				// @ts-ignore
				knex.raw("CONCAT(idsequence,'-' ,idsubtype)"),
				duplicatedSubtyping.map(({ combination }) => combination)
			)
			.select("id", "idsequence", "idsubtype");
		const hashed: { [key: string]: number[] } = {};
		duplicated.forEach(({ idsequence, idsubtype, id }) => {
			if (hashed[`${idsequence}_${idsubtype}`]) return hashed[`${idsequence}_${idsubtype}`].push(id);
			hashed[`${idsequence}_${idsubtype}`] = [id];
		});
		const bulkDelete: number[] = [];
		Object.keys(hashed).forEach((gi) => {
			const [_keep, ...toDelete] = hashed[gi];
			if (toDelete.length) bulkDelete.push(...toDelete);
		});
		if (!bulkDelete.length) continue;
		await knex.withSchema(virus.database_name).table("subtype_reference_sequence").whereIn("id", bulkDelete).del();
	}
	res.send({ status: "success" });
};

export const verifySubtypes = async (virus: IVirus | Omit<IVirus, "id">, type: "genotype" | "subtype" = "genotype") => {
	const db = knexLocal({
		client: "mysql2",
		connection: {
			...knexfile.production.connection,
			database: virus.database_name,
		},
	});
	const [feature, existingSubtypes] = await Promise.all([
		db
			.table("feature_qualifier")
			.where("name", "=", "db_xref")
			.andWhere("value", "like", "taxon:%")
			.select("*")
			.first(),
		db
			.table("subtype")
			.where("isGenotype", "=", type === "genotype")
			.select(),
	]);
	const taxon = feature?.value;
	if (!taxon) throw new Error("sequence without gi");
	const ncbi_id = taxon.split(":").pop();
	const subtypes = await getSubtypes(ncbi_id);
	const accessions = await getRefseqs(
		Object.values(subtypes)
			.flat()
			.map(({ taxonomy_id }) => taxonomy_id)
			.filter(Boolean) as string[],
		type === "genotype"
	);
	const newSubtypes = Object.values(subtypes)
		.map(
			(value) =>
				accessions?.[value.taxonomy_id as string] && { ...value, accessions: accessions?.[value.taxonomy_id as string] }
		)
		.filter(Boolean)
		.filter(({ accessions }) => accessions.length);
	for (const { name, accessions } of newSubtypes) {
		let isNew = false;
		const sequences = await db.table("sequence").whereIn("accession_version", accessions);
		let idsubtype = existingSubtypes.find((subtype) => subtype.description.toLowerCase() === name.toLowerCase())?.id;
		if (!idsubtype) {
			isNew = true;
			idsubtype = (
				await db.table("subtype").insert({
					description: name,
					isGenotype: type === "genotype",
				})
			)[0];
		}
		const sequenceIds = [];
		for (const accession of accessions) {
			const alreadyStored = sequences.filter(({ accession_version }) => accession_version === accession);
			if (alreadyStored.length > 0) {
				sequenceIds.push(...alreadyStored.map(({ id }) => id));
				continue;
			}
			try {
				const id = await acquireAndSaveSequence(accession, db, virus);
				if (!id) continue;
				sequenceIds.push(id);
			} catch (error) {
				log(`Accession version ${accession} for subtype ${name} not found`, virus.name);
			}
		}
		if (sequenceIds.length === 0) {
			log(`no sequences to support subtype ${name}`, virus.name);
		} else {
			await db.table("subtype_reference_sequence").insert(
				sequenceIds.map((idsequence) => ({
					idsequence,
					idsubtype,
					is_refseq: true,
				}))
			);
		}
		if (isNew) log(`subtype ${name} added with ${sequenceIds.length} sequences.`, virus.name);
	}
	log(`subtypes up-to-date (${new Date()})`, virus.name);
	await db.destroy();
};

export const create = async (req: Request, res: Response) => {
	const response = req.body;
	log(`[create virus] - ${response}`);
	const organism_data = await tryToGetOrganismInfos(response.organism_refseq.trim());

	const data = {
		user_name: response.user_name || "",
		user_email: response.user_email || "",
		organism_name:
			organism_data?.name.toLowerCase() !== "no items found" ? organism_data?.name : response.organism_name,
		organism_taxonomy_id: organism_data?.taxonomyId || null,
		organism_taxonomy: organism_data?.taxonomy || "",
		organism_refseq: response.organism_refseq.trim() || "",
		organism_subtypes: Array.isArray(response.organism_subtypes) ? response.organism_subtypes : [],
	};

	const org_name = await ncbi_utils.getOrganismName(data.organism_refseq);
	if (org_name?.length) data.organism_name = org_name;

	const db_name = md5(data.organism_name.toLowerCase());
	if (await verifyCreateData(res, data, data.organism_name)) {
		//alright now we need to find this virus in db or create a new one.
		const already_exists = await knex("virus").where("database_name", db_name);
		if (already_exists.length)
			return res.send({ status: "success", data: { message: "Database for this Virus already exists!" } });
		//all clear, lets create a new database
		//first the virus model for central database
		const virus_model = {
			name: data.organism_name,
			reference_accession: data.organism_refseq,
			...(data.organism_taxonomy_id && { taxonomy_id: data.organism_taxonomy_id }),
			...(data.organism_taxonomy && { taxonomy: data.organism_taxonomy }),
			database_name: db_name,
		};
		await knex("virus").insert(virus_model);
		const virus = await knex("virus").where("database_name", db_name).first();
		// now we should instantiate the database
		await createStatement(db_name);
		// lets populate the virus db with the references/subtypes sequences
		const knex_virus = knexLocal({
			client: "mysql2",
			connection: {
				...knexfile.production.connection,
				database: db_name,
			},
			pool: {
				min: 1,
				max: 1,
			},
		});
		// download the reference sequence and after it the subtypes sequences
		res.send({ status: "success", data: { message: "Virus database created successfully." } });
		await acquireAndSaveSequence(data.organism_refseq, knex_virus, virus);
		await verifySubtypes(virus_model);
		await knex_virus.destroy();
	}
};

export const deleteVirus = async (req: Request, res: Response) => {
	const { id } = req.params;
	await knex("virus").where("id", id).del();
	res.send({ status: "success", data: { message: "Virus removed successfully." } });
};

export const verifyCreateData = async (_: Response, data: any, organism_name: string) => {
	if (organism_name.toLowerCase() === "no items found") throw new Error("Please, check your refseq identifier.");
	if (data.organism_refseq === "") throw new Error("Please, inform an organism RefSeq.");
	return true;
};

export const tryToGetOrganismInfos = async (refseq: string) => {
	try {
		const new_refseq = refseq.includes(".") ? refseq.split(".")[0] : refseq;
		const html = (await axios.get(`https://www.ncbi.nlm.nih.gov/nuccore/${new_refseq}`))?.data;
		const dom = new JSDOM(html);
		const name = dom.window.document.querySelector(".rprtheader>h1")?.textContent?.trim();
		const taxonomyId = html.match(/ORGANISM=(\d+)/)?.[1] || null;
		const taxonomyData: Record<string, { name?: string; taxonomy?: string }> = await getTaxonomyFromApi([taxonomyId]);
		const taxonomyInfos = taxonomyData[taxonomyId];
		return {
			taxonomyId,
			...(taxonomyInfos || { taxonomy: null }),
			name: taxonomyInfos.name || name || dom.window.document.title.split(" - Nucleotide")[0],
		};
	} catch (error) {
		console.error(error);
	}
};

export const acquireAndSaveSequence = async (
	accession_version: string,
	knex_virus?: typeof knex,
	virus: IVirus | Omit<IVirus, "id"> = {} as IVirus,
	retries = 0
): Promise<number | undefined> => {
	try {
		const db = knex_virus ?? knex;
		const seq = await ncbi_utils.downloadSingleSequence(accession_version);
		const raw_sequence = seq?.INSDSet?.INSDSeq;
		const sequence_parsed = await ncbi_utils.modulateFromINSDSeqToVSDBMSeq(raw_sequence);
		if (!sequence_parsed) throw new Error(`Sequence not found for accession ${accession_version}`);
		const sequence = { ...sequence_parsed };
		if ("features" in sequence) delete sequence.features;
		if (
			sequence.taxonomy?.toLowerCase().includes("unclassified") ||
			sequence.taxonomy?.toLowerCase().includes("artificial sequence")
		) {
			throw new Error(
				`Unclassified/artificial sequence for accession [${sequence.accession_version}]: ${virus.taxonomy} - ${sequence_parsed.taxonomy}`
			);
		}
		if (!sequence?.taxonomy || sequence?.taxonomy?.split(";")?.length < 7) {
			throw new Error(
				`Taxonomy classification too short for accession [${sequence.accession_version}]: ${virus.taxonomy} - ${sequence_parsed.taxonomy}`
			);
		}
		if (virus.taxonomy && sequence.taxonomy) {
			const contains = sequence_parsed.taxonomy?.includes(virus.taxonomy);
			const isContained = virus.taxonomy?.includes(sequence.taxonomy);
			if (!contains && !isContained)
				throw new Error(
					`Taxonomy mismatch for accession [${sequence_parsed.accession_version}]: ${virus.taxonomy} - ${sequence_parsed.taxonomy}`
				);
		}
		//first save the sequence itself and then get the id
		const exists = await db("sequence").select("id").where("accession_version", sequence.accession_version).first();
		if (exists?.id) return exists.id;

		const id_sequence = (await db("sequence").insert(sequence))[0];
		for (const feature_qualifiers of sequence_parsed.features as any[]) {
			feature_qualifiers.idsequence = id_sequence;
			const feature = { ...feature_qualifiers };
			if ("qualifiers" in feature) delete feature.qualifiers;

			const id_feature = await db("sequence_feature").insert(feature);
			const qualifiers = feature_qualifiers.qualifiers.map(({ name, value }: IFeatureQualifier) => ({
				name,
				value,
				idsequence_feature: id_feature,
			}));
			if (qualifiers.length > 0) await db("feature_qualifier").insert(qualifiers);
		}
		return id_sequence;
	} catch (error) {
		if (retries < 5) {
			await new Promise((resolve) => setTimeout(resolve, 200));
			return acquireAndSaveSequence(accession_version, knex_virus, virus, retries + 1);
		}
		console.error((error as Error).message);
	}
};

const downloadAndStoreMultipleSequences = async (
	virus: IVirus,
	gis: string,
	retries = 0
): Promise<Array<number> | undefined> => {
	try {
		log("Downloading: " + gis, virus.name);
		const raw_sequence = (await ncbi_utils.downloadSingleSequenceFromGi(gis))?.INSDSet?.INSDSeq;
		const sequences_parsed = (Array.isArray(raw_sequence) ? raw_sequence : [raw_sequence])
			.map((raw_sequence) => ncbi_utils.modulateFromINSDSeqToVSDBMSeq(raw_sequence))
			.filter(Boolean) as Array<IViralSequence>;
		//@ts-ignore
		const sequences = sequences_parsed.map(({ features: _, ...sequence }) => sequence);
		//first save the sequence itself and then get the id
		const id_sequences = await Promise.all(
			sequences.map(
				async (sequence) => (await knex.withSchema(virus.database_name).table("sequence").insert(sequence))[0]
			)
		);
		await Promise.all(
			sequences_parsed.map(async (sequence_parsed, index) => {
				for (const feature_qualifiers of sequence_parsed.features as any[]) {
					feature_qualifiers.idsequence = id_sequences[index];
					const feature = { ...feature_qualifiers };
					if ("qualifiers" in feature) delete feature.qualifiers;

					const id_feature = await knex.withSchema(virus.database_name).table("sequence_feature").insert(feature);
					const qualifiers = feature_qualifiers.qualifiers.map((element: IFeatureQualifier) => ({
						...element,
						idsequence_feature: id_feature,
					}));
					if (qualifiers.length) {
						await knex.withSchema(virus.database_name).table("feature_qualifier").insert(qualifiers);
					}
				}
			})
		);
		return id_sequences;
	} catch (error) {
		if (retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return await downloadAndStoreMultipleSequences(virus, gis, retries + 1);
		}
		log(`error downloading sequence ${gis}`, virus.name);
	}
};
const downloadAndStoreSingleSequence = async (virus: IVirus, gi: string, retries = 0): Promise<number | undefined> => {
	let raw_sequence;
	let sequence_parsed;
	try {
		log("Downloading: " + gi, virus.name);
		raw_sequence = (await ncbi_utils.downloadSingleSequenceFromGi(gi))?.INSDSet?.INSDSeq;
		sequence_parsed = ncbi_utils.modulateFromINSDSeqToVSDBMSeq(raw_sequence);
		if (!sequence_parsed) throw new Error(`Sequence not found for gi ${gi}`);
		const sequence = { ...sequence_parsed };
		if ("features" in sequence) delete sequence.features;
		//first save the sequence itself and then get the id
		const id_sequence = (await knex.withSchema(virus.database_name).table("sequence").insert(sequence))[0];
		for (const feature_qualifiers of sequence_parsed.features as any[]) {
			feature_qualifiers.idsequence = id_sequence;
			const feature = { ...feature_qualifiers };
			if ("qualifiers" in feature) delete feature.qualifiers;

			const id_feature = await knex.withSchema(virus.database_name).table("sequence_feature").insert(feature);
			const qualifiers = feature_qualifiers.qualifiers.map((element: IFeatureQualifier) => ({
				...element,
				idsequence_feature: id_feature,
			}));
			if (qualifiers.length) {
				await knex.withSchema(virus.database_name).table("feature_qualifier").insert(qualifiers);
			}
		}
		return id_sequence;
	} catch (error) {
		if (retries < 10 && !(error as Error).message.includes("Type error")) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return await downloadAndStoreSingleSequence(virus, gi, retries + 1);
		}
		log(`error downloading sequence ${gi}`, virus.name);
		if (retries < 10 && !(error as Error).message.includes("Type error"))
			log(`Error downloading [${gi}] ${(error as Error).message}`, virus.name);
	}
};

export const downloadViralSequenceDatabase = async (virus: IVirus) => {
	try {
		await verifySubtypes(virus, "genotype");
		await verifySubtypes(virus, "subtype");
		return;
		log("Downloading organism info...", virus.name);
		const ncbi_gis = await ncbi_utils.getGiListFromOrganismName(virus.name);
		// const ncbi_gis = await ncbi_utils.getGiList(virus.name);
		if (ncbi_gis?.esearchresult?.idlist?.length) {
			log(`Found ${ncbi_gis?.esearchresult?.count} sequences on NCBI.`, virus.name);
			log("Working on diffList...", virus.name);
			const gis: { gi: string }[] = await knex.withSchema(virus.database_name).table("sequence").distinct("gi");
			const databaseGis = new Map();
			for (const { gi } of gis) {
				databaseGis.set(gi, true);
			}
			const final_gis: string[] = ncbi_gis.esearchresult.idlist.filter((gi: string) => !databaseGis.has(gi));
			databaseGis.clear();
			log(`DiffList contains ${final_gis.length} sequences.`, virus.name);
			if (final_gis.length > 0) {
				log("Starting sequence download...", virus.name);
				const chunks = hashMapFunctions.toChunkArray(final_gis, 5);
				// for (const chunk of chunks) {
				// 	await Promise.all(chunk.map((gi: string) => downloadAndStoreSingleSequence(virus, gi)));
				// }
				while (chunks.length) {
					const chunk = chunks.shift() as string[];
					// await downloadAndStoreSingleSequence(virus, chunk.join(","));
					// await downloadAndStoreMultipleSequences(virus, chunk.join(","));
					await Promise.allSettled(chunk.map((gi: string) => downloadAndStoreSingleSequence(virus, gi)));
				}

				log("All sequences downloaded.", virus.name);
			}
			await knex.table("virus").where("id", "=", virus.id).update({ latest_update: knex.fn.now() });
		} else {
			log("No gi list found from ncbi, aborting update", virus.name);
		}
	} catch (error) {
		console.error(error);
	}
};
export default {
	getAll,
	getById,
	update,
	create,
	deleteVirus,
	verifyCreateData,
	tryToGetOrganismName: tryToGetOrganismInfos,
	acquireAndSaveSequence,
	downloadViralSequenceDatabase,
	cleanUpDuplicateGis,
	cleanUpDuplicateSubtypeMap,
};
