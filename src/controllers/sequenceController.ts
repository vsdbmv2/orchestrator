import { IVirus } from "./../@types";
import { Request, Response } from "express";
import dotenv from "dotenv";
import knex from "../services/database";
import taskManager from "../utils/taskManager";
import { hasReachedMaxMemory, log } from "../utils/helpers";
import { acquireAndSaveSequence } from "./virusController";

import knexLocal from "knex";
import knexfile from "../../knexfile";

dotenv.config();

type idSequenceArray = { id: number; sequence: string }[];

const scheduleLocalMappingWorks = async (virus: IVirus) => {
	if (hasReachedMaxMemory()) return log(`local alignment not scheduled for ${virus.name} due to memory available`);
	log("scheduling local alignment mapping", virus.name);
	const [subtypes, sequences, already_mapped] = await Promise.all([
		knex
			.withSchema(virus.database_name)
			.table("subtype")
			.select("subtype.id", "sequence.sequence")
			.join("subtype_reference_sequence", "subtype.id", "subtype_reference_sequence.idsubtype")
			.join("sequence", "sequence.id", "subtype_reference_sequence.idsequence")
			.where("subtype_reference_sequence.is_refseq", "=", 1),
		knex.withSchema(virus.database_name).table("sequence").select("id", "sequence"),
		knex.withSchema(virus.database_name).table("subtype_reference_sequence").select("*").where("is_refseq", "=", 0),
	]);
	log(`${sequences.length} sequences and ${subtypes.length} subtype sequences to align`, virus.name);
	for (const { idsubtype, idsequence } of already_mapped) {
		taskManager.addWorkHashMap("local-mapping", idsequence, idsubtype);
	}
	for (const sequence of sequences) {
		if (hasReachedMaxMemory()) break;
		for (const subtype of subtypes) {
			if (!sequence.sequence.length || !subtype.sequence.length) continue;
			taskManager.registerWork(
				"local-mapping",
				virus.database_name,
				sequence.sequence,
				sequence.id,
				subtype.sequence,
				subtype.id
			);
		}
	}
	sequences.length = 0;
	subtypes.length = 0;
	taskManager.clearWorkHashMap();
	log(`${taskManager.size} local alignments registered successfully`, virus.name);
};
const scheduleGlobalMappingWorks = async (virus: IVirus) => {
	if (hasReachedMaxMemory()) return log(`global alignment not scheduled for ${virus.name} due to memory available`);
	log("scheduling global alignment mapping", virus.name);
	let refSeq = await knex
		.withSchema(virus.database_name)
		.table("sequence")
		.where({ accession_version: virus.reference_accession })
		.first();
	if (!refSeq) {
		const knex_virus = knexLocal({
			client: "mysql2",
			connection: {
				...knexfile.production.connection,
				database: virus.database_name,
			},
			pool: {
				min: 1,
				max: 1,
			},
		});
		await acquireAndSaveSequence(virus.reference_accession, knex_virus, virus);
		await knex_virus.destroy();
		refSeq = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.where({ accession_version: virus.reference_accession })
			.first();
	}
	const alignSequences: idSequenceArray = await knex
		.withSchema(virus.database_name)
		.table("sequence")
		.select("sequence.id", "sequence.sequence")
		.whereNotIn("id", knex.withSchema(virus.database_name).table("sequence_map").distinct("idsequence"))
		.andWhereNot("id", refSeq.id);

	log("sequences to align", virus.name);
	if (!alignSequences.length) return log("all sequences are already mapped globally", virus.name);
	for (const sequence of alignSequences) {
		if (hasReachedMaxMemory()) break;
		if (!sequence.sequence.length || !refSeq.sequence.length) continue;
		taskManager.registerWork(
			"global-mapping",
			virus.database_name,
			sequence.sequence,
			sequence.id,
			refSeq.sequence,
			refSeq.id
		);
	}
	alignSequences.length = 0;
	taskManager.clearWorkHashMap();
	log(`${taskManager.size} global alignments registered successfully`, virus.name);
};

export default {
	async getCountSubtypeGeneral(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");
		// JOIN ${virus.database_name}.subtype on subtype.id = subtype_reference_sequence.idsubtype AND description not like '%gen%'
		const [subtypeMap]: { idsequence: number; idsubtype: number }[][] = await knex.raw(
			`
		SELECT
			idsequence,
			idsubtype
		FROM
				${virus.database_name}.subtype_reference_sequence
		JOIN ${virus.database_name}.subtype on subtype.id = subtype_reference_sequence.idsubtype AND subtype.description not like '%gen%' 
		WHERE (idsequence, subtype_score) in (
			select idsequence, MAX(subtype_score)
				FROM ${virus.database_name}.subtype_reference_sequence
			group by idsequence
		)
		`.replace(/(\t|\n|\s)/g, " ")
		);
		const subtypes = await knex
			.withSchema(virus.database_name)
			.table("subtype")
			.select("*")
			.whereIn(
				"id",
				subtypeMap.map(({ idsubtype }) => idsubtype)
			);
		const hm: { [key: number]: number } = {};
		for (const subtype of subtypes) {
			hm[subtype.id] = {
				...subtype,
				count: subtypeMap.reduce((acc, curr) => acc + (curr.idsubtype === subtype.id ? 1 : 0), 0),
			};
		}
		return res.send({
			status: "success", // @ts-ignore
			data: Object.values(hm).map(({ description, count }) => `${description}, ${count}`),
		});
	},
	async getCount(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");
		const data = await knex.withSchema(virus.database_name).table("sequence").count("id", { as: "count" }).first();
		return res.send({ status: "success", data });
	},
	async getCoverageAvg(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");

		const data: any = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.avg("coverage_pct as coverage_avg")
			.whereNotNull("coverage_pct")
			.first();
		if (data?.coverage_avg) data.coverage_avg = 0;

		return res.send({ status: "success", data });
	},
	async getTranslationCount(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");
		const data = await knex
			.withSchema(virus.database_name)
			.table("feature_qualifier")
			.where("name", "translation")
			.orWhere("name", "peptide")
			.count("id", { as: "count" })
			.first();
		return res.send({ status: "success", data });
	},
	async getCountPerDay(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");
		const data = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.select("creationdate")
			.count("id", { as: "count" })
			.groupBy("creationdate");
		return res.send({ status: "success", data });
	},
	async getCountPerCountry(req: Request, res: Response) {
		const { id } = req.params;
		const virus = await knex("virus").where("id", id).first();

		if (!virus) throw new Error("Invalid parameters.");
		const data = await knex
			.withSchema(virus.database_name)
			.table("sequence")
			.select(knex.raw("distinct SUBSTRING_INDEX(country, ':', 1) as country_name, count(id) as count"))
			.whereNot("country", "")
			.groupBy("country_name");
		return res.send({ status: "success", data });
	},

	async scheduleMappingWorks(virus: IVirus) {
		if (hasReachedMaxMemory()) return log(`local alignment not scheduled for ${virus.name} due to memory available`);
		await scheduleGlobalMappingWorks(virus);
		if (hasReachedMaxMemory()) return;
		await scheduleLocalMappingWorks(virus);
	},
};
