import { Request, Response } from "express";
import { IVirus, IAssay } from "../@types";
import knex from "../services/database";
import { hashObjectBy } from "../utils/hashMapFunctions";
import { log } from "../utils/helpers";

export const getCount = async (req: Request, res: Response) => {
	const { id } = req.params;
	const virus = await knex("virus").where("id", id).first();
	const data = await knex.withSchema(virus.database_name).table("epitope").count("id", {
		as: "count",
	});

	if (virus)
		return res.send({
			status: "success",
			data,
		});
	throw new Error("Invalid parameters.");
};

export const getIedbCount = async (req: Request, res: Response) => {
	const data = await knex
		.withSchema("iedb_public")
		.table("epitope")
		.count("epitope_id", {
			as: "count",
		})
		.first();

	res.send({
		status: "success",
		data,
	});
};
export const getIedbAssayCount = async (req: Request, res: Response) => {
	const b_cell = await knex
		.withSchema("iedb_public")
		.table("bcell")
		.count("bcell_id", {
			as: "bcell_count",
		})
		.first();
	const t_cell = await knex
		.withSchema("iedb_public")
		.table("tcell")
		.count("tcell_id", {
			as: "tcell_count",
		})
		.first();
	const mhc_bind = await knex
		.withSchema("iedb_public")
		.table("mhc_bind")
		.count("mhc_bind_id", {
			as: "mhc_bind_count",
		})
		.first();

	const data = {
		...b_cell,
		...t_cell,
		...mhc_bind,
	};

	res.send({
		status: "success",
		data,
	});
};
export const getTopEpitopesWithAssay = async (req: Request, res: Response) => {
	const { id } = req.params;
	const virus = await knex("virus").where("id", id).first();
	const top_epitope = await knex.withSchema(virus.database_name).table("epitope").orderBy("count", "desc");

	const _bcell_assays = await knex.withSchema(virus.database_name).table("bcell_assay").select();
	const bcell_assays = hashObjectBy(_bcell_assays, "epitope_id");
	const _tcell_assays = await knex.withSchema(virus.database_name).table("tcell_assay").select();
	const tcell_assays = hashObjectBy(_tcell_assays, "epitope_id");
	const _mhc_assays = await knex.withSchema(virus.database_name).table("mhc_assay").select();
	const mhc_assays = hashObjectBy(_mhc_assays, "epitope_id");

	const top = [];
	for (const epi of top_epitope) {
		epi.bcell_assays = [];
		epi.tcell_assays = [];
		epi.mhc_assays = [];
		let store = false;
		if (epi.id in bcell_assays) {
			epi.bcell_assays = Array.isArray(bcell_assays[epi.id]) ? bcell_assays[epi.id] : [bcell_assays[epi.id]];
			store = true;
		}
		if (epi.id in tcell_assays) {
			epi.tcell_assays = Array.isArray(tcell_assays[epi.id]) ? tcell_assays[epi.id] : [tcell_assays[epi.id]];
			store = true;
		}
		if (epi.id in mhc_assays) {
			epi.mhc_assays = Array.isArray(mhc_assays[epi.id]) ? mhc_assays[epi.id] : [mhc_assays[epi.id]];
			store = true;
		}

		if (store) {
			top.push(epi);
		}
	}

	res.send({
		status: "success",
		data: top,
	});
};

const getCommonDataForPair = async () => {
	const __curatedEpitopes = await knex
		.withSchema("iedb_public")
		.table("curated_epitope")
		.select("curated_epitope_id", "e_object_id");
	const curatedEpitope = hashObjectBy(__curatedEpitopes, "e_object_id");

	const __epitopeObject = await knex
		.withSchema("iedb_public")
		.table("epitope_object")
		.select("object_id", "epitope_id");
	const epitope_object = hashObjectBy(__epitopeObject, "epitope_id");

	const __epitope = await knex.withSchema("iedb_public").table("epitope").select("epitope_id", "linear_peptide_seq");
	const epitope = hashObjectBy(__epitope, "linear_peptide_seq");

	const __organismNames = await knex
		.withSchema("iedb_public")
		.table("organism_names")
		.select("name_txt", "organism_id");
	const organism_names = hashObjectBy(__organismNames, "organism_id");
	return {
		curatedEpitope,
		epitope_object,
		epitope,
		organism_names,
	};
};

export const pairEpitopesBcellAssays = async (virus: IVirus) => {
	log("[epitope-mapper][b-cell] - Tracking assays...", virus.name);
	const top_epitope = await knex.withSchema(virus.database_name).table("epitope").where("count", ">", 1000);
	const __bCells = await knex
		.withSchema("iedb_public")
		.table("bcell")
		.select("h_organism_id", "as_immunization_comments", "as_char_value", "bcell_id", "curated_epitope_id");
	const bCell = hashObjectBy(__bCells, "curated_epitope_id");

	const { curatedEpitope, epitope_object, epitope, organism_names } = await getCommonDataForPair();

	const assays = [];
	if (bCell) {
		for (const top_ep of top_epitope) {
			if (top_ep.linearsequence in epitope) {
				if (epitope[top_ep.linearsequence].epitope_id in epitope_object) {
					if (epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id in curatedEpitope) {
						if (
							curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id in
							bCell
						) {
							let bcell_assays =
								bCell[
									curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id
								];
							if (!Array.isArray(bcell_assays)) {
								bcell_assays = [bcell_assays];
							}
							for (const bcell_assay of bcell_assays) {
								assays.push({
									bcell_id: bcell_assay.bcell_id,
									result: bcell_assay.as_char_value,
									comment: bcell_assay.as_immunization_comments,
									organism_name:
										bcell_assay.h_organism_id in organism_names
											? Array.isArray(organism_names[bcell_assay.h_organism_id])
												? organism_names[bcell_assay.h_organism_id][0].name_txt
												: organism_names[bcell_assay.h_organism_id].name_txt
											: "",
									epitope_id: top_ep.id,
									iedb_epitope_id: epitope[top_ep.linearsequence].epitope_id,
								});
							}
						}
					}
				}
			}
		}
	}
	log(`[epitope-mapper][b-cell] - ${assays.length} bcell assays found.`, virus.name);
	await knex.withSchema(virus.database_name).table("bcell_assay").truncate();
	await knex.withSchema(virus.database_name).table("bcell_assay").insert(assays);
};
export const pairEpitopesTcellAssays = async (virus: IVirus) => {
	log("[epitope-mapper][t-cell] - Tracking tcell assays...", virus.name);
	const top_epitope = await knex.withSchema(virus.database_name).table("epitope").where("count", ">", 1000);
	const __t_cell = await knex
		.withSchema("iedb_public")
		.table("tcell")
		.select("h_organism_id", "as_immunization_comments", "as_char_value", "tcell_id", "curated_epitope_id");
	const t_cell = hashObjectBy(__t_cell, "curated_epitope_id");

	const { curatedEpitope, epitope_object, epitope, organism_names } = await getCommonDataForPair();

	const assays: IAssay[] = [];
	if (t_cell) {
		for (const top_ep of top_epitope) {
			if (top_ep.linearsequence in epitope) {
				if (epitope[top_ep.linearsequence].epitope_id in epitope_object) {
					if (epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id in curatedEpitope) {
						if (
							curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id in
							t_cell
						) {
							let tcell_assays =
								t_cell[
									curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id
								];
							if (!Array.isArray(tcell_assays)) {
								tcell_assays = [tcell_assays];
							}
							for (const tcell_assay of tcell_assays) {
								assays.push({
									tcell_id: tcell_assay.tcell_id,
									result: tcell_assay.as_char_value,
									comment: tcell_assay.as_immunization_comments,
									organism_name:
										tcell_assay.h_organism_id in organism_names
											? Array.isArray(organism_names[tcell_assay.h_organism_id])
												? organism_names[tcell_assay.h_organism_id][0].name_txt
												: organism_names[tcell_assay.h_organism_id].name_txt
											: "",
									epitope_id: top_ep.id,
									iedb_epitope_id: epitope[top_ep.linearsequence].epitope_id,
								});
							}
						}
					}
				}
			}
		}
	}
	log(`[epitope-mapper][t-cell] - ${assays.length} tcell assays found.`, virus.name);
	await knex.withSchema(virus.database_name).table("tcell_assay").truncate();
	await knex.withSchema(virus.database_name).table("tcell_assay").insert(assays);
};
export const pairEpitopesMHCAssays = async (virus: IVirus) => {
	log("[epitope-mapper][mhc] - Tracking mhc assays...", virus.name);
	const top_epitope = await knex.withSchema(virus.database_name).table("epitope").where("count", ">", 1000);
	const __mhc = await knex
		.withSchema("iedb_public")
		.table("mhc_bind")
		.select(
			"as_num_value",
			"as_inequality",
			"mhc_allele_name",
			"as_comments",
			"as_char_value",
			"mhc_bind_id",
			"curated_epitope_id"
		);
	const mhc = hashObjectBy(__mhc, "curated_epitope_id");

	const { curatedEpitope, epitope_object, epitope } = await getCommonDataForPair();

	const assays: IAssay[] = [];
	if (mhc) {
		for (const top_ep of top_epitope) {
			if (top_ep.linearsequence in epitope) {
				if (epitope[top_ep.linearsequence].epitope_id in epitope_object) {
					if (epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id in curatedEpitope) {
						if (
							curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id in
							mhc
						) {
							let mhc_assays =
								mhc[
									curatedEpitope[epitope_object[epitope[top_ep.linearsequence].epitope_id].object_id].curated_epitope_id
								];
							if (!Array.isArray(mhc_assays)) {
								mhc_assays = [mhc_assays];
							}
							for (const mhc_assay of mhc_assays) {
								assays.push({
									mhc_id: mhc_assay.mhc_id,
									result: mhc_assay.as_char_value,
									comment: mhc_assay.as_comments,
									allele_name: mhc_assay.mhc_allele_name,
									inequality: mhc_assay.as_inequality,
									value: mhc_assay.as_num_value,
									epitope_id: top_ep.id,
									iedb_epitope_id: epitope[top_ep.linearsequence].epitope_id,
								});
							}
						}
					}
				}
			}
		}
	}
	log(`[epitope-mapper][mhc] - ${assays.length} mhc assays found.`, virus.name);
	await knex.withSchema(virus.database_name).table("mhc_assay").truncate();
	await knex.withSchema(virus.database_name).table("mhc_assay").insert(assays);
};

export default {
	getCount,
	getIedbCount,
	getIedbAssayCount,
	getTopEpitopesWithAssay,
	pairEpitopesBcellAssays,
	pairEpitopesTcellAssays,
	pairEpitopesMHCAssays,
};
