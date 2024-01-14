import { IVirus } from "./../@types";
import { Request, Response } from "express";
import dotenv from "dotenv";
import knex from "../services/database";
import taskManager from "../utils/taskManager";
import { getMemoryUsage, log } from "../utils/helpers";

dotenv.config();

export default {
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
		const [sequences, subtypes] = await Promise.all([
			knex.withSchema(virus.database_name).table("sequence").select("id", "sequence").where({
				id_subtype: null,
			}),
			knex
				.withSchema(virus.database_name)
				.table("subtype")
				.select("subtype.id", "sequence.sequence")
				.join("subtype_reference_sequence", "subtype.id", "subtype_reference_sequence.idsubtype")
				.join("sequence", "sequence.id", "subtype_reference_sequence.idsequence"),
		]);
		log(`${sequences.length} sequences and ${subtypes.length} subtype sequences to align`, virus.name);
		let count = 0;
		for (const sequence of sequences) {
			if (getMemoryUsage().rss > 2 * 1024) break;
			for (const subtype of subtypes) {
				taskManager.registerWork("local-mapping", sequence.sequence, sequence.id, subtype.sequence, subtype.id);
				count++;
			}
		}
		log(`${count} local alignments registered successfully`, virus.name);
	},
};
