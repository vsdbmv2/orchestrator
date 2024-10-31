import { IVirus } from "./../@types";
import { Request, Response } from "express";
import dotenv from "dotenv";
import knex from "../services/database";
import taskManager from "../utils/taskManager";
import { getMemoryUsage, hasReachedMaxMemory, log } from "../utils/helpers";

dotenv.config();

type idSequenceArray = { id: number; sequence: string }[];

const scheduleLocalMappingWorks = async (virus: IVirus) => {
	if (hasReachedMaxMemory()) return log(`local alignment not scheduled for ${virus.name} due to memory available`);
	log("scheduling local alignment mapping", virus.name);
	const maxAlignmentsPerTime = 1_000_000;

	const alignmentsMissing: Array<{
		id: number;
		id_subtype: number;
		id_sequence_subtype: number;
		sequence: string;
		subtype_sequence: string;
	}> = await knex
		.withSchema(virus.database_name)
		.table("sequence as s")
		.join(knex.raw(`\`${virus.database_name}\`.\`subtype\` as sub`))
		.join("subtype_reference_sequence as ref", "sub.id", "ref.idsubtype")
		.join("sequence as seq", "seq.id", "ref.idsequence")
		.select({
			id: "s.id",
			id_sequence_subtype: "seq.id",
			id_subtype: "sub.id",
			sequence: "s.sequence",
			subtype_sequence: "seq.sequence",
		})
		.where("s.id", "!=", "seq.id")
		.andWhere(
			knex.raw(`
			concat(s.id, '-', sub.id) not in (
    		SELECT concat(idsequence, '-', idsubtype) as hash FROM ${virus.database_name}.subtype_reference_sequence
    	)`)
		)
		// .groupByRaw("concat(s.id, '-', sub.id)")
		.limit(maxAlignmentsPerTime);

	log(`${alignmentsMissing.length} alignments missing`, virus.name);
	if (!alignmentsMissing.length) return;

	while (alignmentsMissing.length) {
		const itHasReachedMaxMemory = hasReachedMaxMemory();
		const sub = alignmentsMissing.splice(alignmentsMissing.length - 10, alignmentsMissing.length);
		if (itHasReachedMaxMemory) {
			console.log({ itHasReachedMaxMemory, memory: getMemoryUsage().rss });
			break;
		}
		for (const sequences of sub) {
			if (!sequences || !sequences.sequence.length || !sequences.subtype_sequence.length) continue;
			taskManager.registerWork(
				"local-mapping",
				virus.database_name,
				sequences.sequence,
				sequences.id,
				sequences.subtype_sequence,
				sequences.id_sequence_subtype,
				sequences.id_subtype
			);
		}
	}
	alignmentsMissing.length = 0;
	console.log({
		itHasReachedMaxMemory: hasReachedMaxMemory(),
		memory: getMemoryUsage().rss,
		alignmentsMissing: alignmentsMissing.length,
	});
	// if (gc) gc();
	log(`${taskManager.size} local alignments registered successfully`, virus.name);
};
const scheduleGlobalMappingWorks = async (virus: IVirus) => {
	if (hasReachedMaxMemory()) return log(`global alignment not scheduled for ${virus.name} due to memory available`);
	log("scheduling global alignment mapping", virus.name);
	const refSeq = await knex
		.withSchema(virus.database_name)
		.table("sequence")
		.where({ accession_version: virus.reference_accession })
		.first();

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
		// await scheduleGlobalMappingWorks(virus);
		if (hasReachedMaxMemory()) return;
		await scheduleLocalMappingWorks(virus);
		// await knex.withSchema(virus.database_name).table("subtype_reference_sequence").truncate();
		// console.log("truncou saporra as ", new Date().toLocaleString());
		// process.exit(0);
	},
};
