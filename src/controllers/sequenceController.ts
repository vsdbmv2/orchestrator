import { IVirus } from "./../@types";
import { Request, Response } from "express";
import dotenv from "dotenv";
import knex from "../services/database";
import taskManager from "../utils/taskManager";
import { getMemoryUsage, log } from "../utils/helpers";

dotenv.config();

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
		if (getMemoryUsage().rss > 2 * 1024) return;
		log("scheduling local alignment mapping", virus.name);
		const [sequences, subtypes, already_mapped] = await Promise.all([
			knex.withSchema(virus.database_name).table("sequence").select("id", "sequence"),
			knex
				.withSchema(virus.database_name)
				.table("subtype")
				.select("subtype.id", "sequence.sequence")
				.join("subtype_reference_sequence", "subtype.id", "subtype_reference_sequence.idsubtype")
				.join("sequence", "sequence.id", "subtype_reference_sequence.idsequence")
				.where("subtype_reference_sequence.is_refseq", "=", 1),
			knex.withSchema(virus.database_name).table("subtype_reference_sequence").select("*").where("is_refseq", "=", 0),
		]);
		log(`${sequences.length} sequences and ${subtypes.length} subtype sequences to align`, virus.name);
		for (const { idsubtype, idsequence } of already_mapped) {
			taskManager.addWorkHashMap("local-mapping", idsequence, idsubtype);
		}
		for (const sequence of sequences) {
			if (getMemoryUsage().rss > 3 * 1024) break;
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
	},
};
