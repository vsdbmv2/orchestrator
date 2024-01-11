import { Request, Response } from "express";
import knexLocal from "knex";
import dotenv from "dotenv";
dotenv.config();

import { IVirus, IUser, IFeatureQualifier } from "../@types";
import knex from "../services/database";
import axios from "axios";
import { JSDOM } from "jsdom";

import md5 from "md5";
import createStatement from "../utils/viral_model";
import ncbi_utils from "../services/ncbi_utils";
import hashMapFunctions from "../utils/hashMapFunctions";
import { Knex } from "knex";

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

export const create = async (req: Request, res: Response) => {
	const response = req.body;
	console.log(response);
	const organism_name = (await tryToGetOrganismName(response.organism_refseq.trim())) as string;

	const data = {
		user_name: response.user_name || "",
		user_email: response.user_email || "",
		organism_name: organism_name.toLowerCase() !== "no items found" ? organism_name : response.organism_name,
		organism_refseq: response.organism_refseq.trim() || "",
		organism_subtypes: Array.isArray(response.organism_subtypes) ? response.organism_subtypes : [],
	};

	const org_name = await ncbi_utils.getOrganismName(data.organism_refseq);
	if (org_name && org_name.length > 0) {
		data.organism_name = org_name;
	}

	const db_name = md5(data.organism_name.toLowerCase());
	if (await verifyCreateData(res, data, data.organism_name)) {
		//alright now we need to find this virus in db or create a new one.
		const already_exists = await knex("virus").where("database_name", db_name);
		if (already_exists.length > 0) {
			res.send({ status: "success", data: { message: "Database for this Virus already exists!" } });
		} else {
			//all clear, lets create a new database
			//first the virus model for central database
			const virus_model = {
				name: data.organism_name,
				reference_accession: data.organism_refseq,
				database_name: db_name,
			};
			await knex("virus").insert(virus_model);
			// now we should instantiate the database
			await createStatement(db_name);
			// lets populate the virus db with the references/subtypes sequences
			const knex_virus = knexLocal({
				client: "mysql2",
				connection: {
					host: process.env.DB_HOST_CONTEXT_VSDBM as string,
					user: process.env.DB_USER_CONTEXT_VSDBM as string,
					password: process.env.DB_PASSWORD_CONTEXT_VSDBM as string,
					database: db_name,
					multipleStatements: true,
				},
				pool: {
					min: 1,
					max: 1,
				},
			});
			// download the reference sequence and after it the subtypes sequences
			await acquireAndSaveSequence(data.organism_refseq, knex_virus);
			//getSequence(data.organism_refseq);
			for (const subtype of data.organism_subtypes) {
				// console.log(Array(40).fill('-').join(''));
				// console.log(subtype);
				const { label, refseq } = subtype;
				//save the subtype
				const id_subtype = (await knex_virus("subtype").insert({ description: label }))[0];
				//save now the refseq or refseqs for the subtype
				if (Array.isArray(refseq)) {
					for (const unique_refseq of refseq) {
						// save the sequence
						const id_sequence = await acquireAndSaveSequence(unique_refseq, knex_virus);
						//link them
						await knex_virus("subtype_reference_sequence").insert({ idsequence: id_sequence, idsubtype: id_subtype });
					}
				} else {
					// save the sequence
					const id_sequence = await acquireAndSaveSequence(refseq, knex_virus);
					//link them
					await knex_virus("subtype_reference_sequence").insert({ idsequence: id_sequence, idsubtype: id_subtype });
				}
			}
			// and then create the cronjob to do stuff and notify the user when all processes were finished
			res.send({ status: "success", data: { message: "Virus database created successfully." } });
		}
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
	if (data.organism_subtypes.length === 0) throw new Error("Please, inform at least one subtype or genotype.");
	return true;
};

export const tryToGetOrganismName = async (refseq: string) => {
	try {
		const new_refseq = refseq.includes(".") ? refseq.split(".")[0] : refseq;
		const html = (await axios.get(`https://www.ncbi.nlm.nih.gov/nuccore/${new_refseq}`))?.data;
		const dom = new JSDOM(html);
		return dom.window.document.title.split(" - Nucleotide")[0];
	} catch (error) {
		console.error(error);
	}
};

export const acquireAndSaveSequence = async (accession_version: string, knex_virus?: typeof knex) => {
	try {
		const db = knex_virus ?? knex;
		const seq = await ncbi_utils.downloadSingleSequence(accession_version);
		const raw_sequence = seq.INSDSet.INSDSeq;
		const sequence_parsed = await ncbi_utils.modulateFromINSDSeqToVSDBMSeq(raw_sequence);
		const sequence = { ...sequence_parsed };
		if ("features" in sequence) delete sequence.features;

		//first save the sequence itself and then get the id
		const exists = await db("sequence").select("id").where("accession_version", sequence.accession_version).first();
		if (exists?.id) return exists.id;

		const id_sequence = (await db("sequence").insert(sequence))[0];
		for (const feature_qualifiers of sequence_parsed.features as any[]) {
			feature_qualifiers.idsequence = id_sequence;
			const feature = { ...feature_qualifiers };
			if ("qualifiers" in feature) delete feature.qualifiers;

			const id_feature = await db("sequence_feature").insert(feature);
			const qualifiers = feature_qualifiers.qualifiers.map((element: IFeatureQualifier) => ({
				...element,
				idsequence_feature: id_feature,
			}));
			if (qualifiers.length > 0) await db("feature_qualifier").insert(qualifiers);
		}
		return id_sequence;
	} catch (error) {
		console.error(error);
	}
};

const downloadAndStoreSingleSequence = async (virus: IVirus, gi: string, retries = 0) => {
	try {
		console.log("Downloading: " + gi);
		const raw_sequence = (await ncbi_utils.downloadSingleSequenceFromGi(gi)).INSDSet.INSDSeq;
		const sequence_parsed = await ncbi_utils.modulateFromINSDSeqToVSDBMSeq(raw_sequence);
		const sequence = { ...sequence_parsed };
		if ("features" in sequence) delete sequence.features;
		//first save the sequence itself and then get the id
		const id_sequence = (await knex.withSchema(virus.database_name).table("sequence").insert(sequence))[0];
		for (const feature_qualifiers of sequence_parsed.features as any[]) {
			feature_qualifiers.idsequence = id_sequence;
			const feature = { ...feature_qualifiers };
			if ("qualifiers" in feature) {
				delete feature.qualifiers;
			}
			const id_feature = await knex.withSchema(virus.database_name).table("sequence_feature").insert(feature);
			// if (feature_qualifiers.qualifiers && Array.isArray(feature_qualifiers.qualifiers)) {
			const qualifiers = feature_qualifiers.qualifiers.map((element: IFeatureQualifier) => ({
				...element,
				idsequence_feature: id_feature,
			}));
			if (qualifiers.length) {
				await knex.withSchema(virus.database_name).table("feature_qualifier").insert(qualifiers);
			}
		}
	} catch (error) {
		if (retries < 10) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await downloadAndStoreSingleSequence(virus, gi, retries + 1);
			return;
		}
		console.error(`error downloading sequence ${gi}`);
	}
};

export const downloadViralSequenceDatabase = async (virus: IVirus) => {
	try {
		console.log("Downloading organism info...");
		const ncbi_gis = await ncbi_utils.getGiListFromOrganismName(virus.name);
		if (ncbi_gis && ncbi_gis.esearchresult && ncbi_gis.esearchresult.idlist) {
			console.log("Found " + ncbi_gis.esearchresult.count + " sequences on NCBI.");
			console.log("Working on diffList...");
			const gis = await knex.withSchema(virus.database_name).table("sequence").select("gi");
			const databaseGis = hashMapFunctions.hashObjectBy(gis, "gi");

			const final_gis: string[] = [];

			for (const gi of ncbi_gis.esearchresult.idlist) {
				if (!(gi in databaseGis)) {
					final_gis.push(gi);
				}
			}
			console.log("DiffList contains " + final_gis.length + " sequences.");
			if (final_gis.length > 0) {
				console.log("Starting sequence download...");
				const chunks = hashMapFunctions.toChunkArray(final_gis, 4);
				for (const chunk of chunks) {
					await Promise.all(chunk.map((gi: string) => downloadAndStoreSingleSequence(virus, gi)));
				}

				console.log("All " + virus.name + " sequences downloaded.");
			}
		} else {
			console.log("Aborting download...");
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
	tryToGetOrganismName,
	acquireAndSaveSequence,
	downloadViralSequenceDatabase,
};
