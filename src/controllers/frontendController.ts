import { Request, Response } from "express";
import hashMapFunction from "../utils/hashMapFunctions";
import knex from "../services/database";

const getIedbEpitopeAssays = async (epitope_id: number) => {
	if (!Array.isArray(epitope_id)) {
		const [iedb_epitope, mhc] = await Promise.all([
			knex.withSchema("iedb_public").table("epitope").where("epitope_id", epitope_id).select().first(),
			getEpitopeQuery("mhc", epitope_id) as Promise<any[]>,
		]);
		let [bcell, tcell] = await Promise.all([
			getEpitopeQuery("bcell", epitope_id) as Promise<any[]>,
			getEpitopeQuery("tcell", epitope_id) as Promise<any[]>,
		]);
		const bcell_duplicated_names = bcell.map((element: any) => element.bcell_id);
		const tcell_duplicated_names = tcell.map((element: any) => element.tcell_id);

		if (hasDuplicates(bcell_duplicated_names)) {
			bcell = handleDuplicatedNames("bcell", bcell);
		}
		if (hasDuplicates(tcell_duplicated_names)) {
			tcell = handleDuplicatedNames("tcell", tcell);
		}

		const dto = { ...iedb_epitope, linearsequence: iedb_epitope.linear_peptide_seq, bcell, tcell, mhc };
		delete dto.linear_peptide_seq;

		return dto;
	} else {
		const [iedb_epitopes, bcell, tcell, mhc] = await Promise.all([
			knex.withSchema("iedb_public").table("epitope").whereIn("epitope_id", epitope_id).select(),
			getEpitopesQueries("bcell", epitope_id) as Promise<any[]>,
			getEpitopesQueries("tcell", epitope_id) as Promise<any[]>,
			getEpitopesQueries("mhc", epitope_id) as Promise<any[]>,
		]);
		const dto: any = {};
		epitope_id.forEach((id) => {
			const iedb_epitope = iedb_epitopes.find((epitope) => epitope.epitope_id === id);
			if (iedb_epitope) {
				delete iedb_epitope.linear_peptide_seq;
				dto[id] = { ...iedb_epitope, linearsequence: iedb_epitope.linear_peptide_seq };
			} else {
				dto[id] = {};
			}
		});

		for (let key in dto) {
			// @ts-ignore
			key = Number(key);
			const bcell_duplicated_names = bcell
				.filter((element: any) => element.epitope_id === key)
				.map((element: any) => element.bcell_id);

			const tcell_duplicated_names = tcell
				.filter((element: any) => element.epitope_id === key)
				.map((element: any) => element.tcell_id);

			let local_bcell, local_tcell;

			if (hasDuplicates(bcell_duplicated_names)) {
				local_bcell = handleDuplicatedNames(
					"bcell",
					bcell.filter((element) => element.epitope_id === key)
				);
			} else {
				local_bcell = bcell.filter((element) => element.epitope_id === key);
			}
			if (hasDuplicates(tcell_duplicated_names)) {
				local_tcell = handleDuplicatedNames(
					"tcell",
					tcell.filter((element) => element.epitope_id === key)
				);
			} else {
				local_tcell = tcell.filter((element) => element.epitope_id === key);
			}

			const local_mhc = mhc.filter((element: any) => element.epitope_id === key);

			dto[key] = {
				bcell: local_bcell || [],
				tcell: local_tcell || [],
				mhc: local_mhc || [],
			};
			//should I delete the key if the epitope has no bcell, tcell or mhc information?

			// if (dto[key].bcell.length === 0) {
			//   delete dto[key].bcell;
			// }
			// if (dto[key].tcell.length === 0) {
			//   delete dto[key].tcell;
			// }
			// if (dto[key].mhc.length === 0) {
			//   delete dto[key].mhc;
			// }
		}
		return dto;
	}
};

const hasDuplicates = (array: any[]) => new Set(array).size !== array.length;

const handleDuplicatedNames = (type: string, data: any[]) => {
	const new_object: any = {};
	for (const info of data) {
		if (info[`${type}_id`] in new_object) {
			new_object[info[`${type}_id`]].name_txt.push(info.name_txt);
			new_object[info[`${type}_id`]].name_class.push(info.name_class);
		} else {
			new_object[info[`${type}_id`]] = { ...info, name_txt: [info.name_txt], name_class: [info.name_class] };
		}
	}
	return Object.values(new_object);
};

const getEpitopeQuery = async (type: string, epitope_id: number) => {
	switch (type) {
		case "bcell": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(...select_fields_iedb[type])
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("bcell", "bcell.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.join("organism_names", "organism_names.organism_id", "bcell.h_organism_id")
				.where("epitope.epitope_id", epitope_id);
		}
		case "tcell": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(...select_fields_iedb[type])
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("tcell", "tcell.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.join("organism_names", "organism_names.organism_id", "tcell.h_organism_id")
				.where("epitope.epitope_id", epitope_id);
		}
		case "mhc": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(
					...select_fields_iedb[type],
					knex.raw("concat(mhc_bind.as_inequality, ' ',mhc_bind.as_num_value, ' nM') as 'quantitative_measure'")
				)
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("mhc_bind", "mhc_bind.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.where("epitope.epitope_id", epitope_id);
		}
	}
};

const getEpitopesQueries = async (type: string, epitope_ids: number[]) => {
	switch (type) {
		case "bcell": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(...select_fields_iedb[type])
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("bcell", "bcell.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.join("organism_names", "organism_names.organism_id", "bcell.h_organism_id")
				.whereIn("epitope.epitope_id", epitope_ids);
			break;
		}
		case "tcell": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(...select_fields_iedb[type])
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("tcell", "tcell.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.join("organism_names", "organism_names.organism_id", "tcell.h_organism_id")
				.whereIn("epitope.epitope_id", epitope_ids);
		}
		case "mhc": {
			return knex
				.withSchema("iedb_public")
				.table("epitope")
				.select(
					...select_fields_iedb[type],
					knex.raw("concat(mhc_bind.as_inequality, ' ',mhc_bind.as_num_value, ' nM') as 'quantitative_measure'")
				)
				.join("epitope_object", "epitope_object.epitope_id", "epitope.epitope_id")
				.join("curated_epitope", "curated_epitope.e_object_id", "epitope_object.object_id")
				.join("mhc_bind", "mhc_bind.curated_epitope_id", "curated_epitope.curated_epitope_id")
				.whereIn("epitope.epitope_id", epitope_ids);
		}
	}
};

const mapNewEpitope = async (database_name: string, linearSequence: string) => {
	const fields_sequence = [
		// 'sequence_feature.id as id_sequence_feature',
		"sequence.id",
		"sequence.accession_version",
		"sequence.locus",
		"sequence.definition",
		"sequence.size",
		"sequence.gi",
		"sequence.country",
		"sequence.pubmed_id",
		"sequence.id_subtype",
		// 'subtype.description as subtype',
		// 'sequence.sequence',
	];

	let hits: { id: number; hits: number }[] = await knex
		.withSchema(database_name)
		.table("feature_qualifier")
		.whereRaw("?? = 'peptide' or ?? = 'translation'", ["feature_qualifier.name", "feature_qualifier.name"])
		.select(
			knex.raw(
				`id, ROUND ((LENGTH(value) - LENGTH( REPLACE ( value, "${linearSequence}", "") )) / CHAR_LENGTH("${linearSequence}")) AS 'hits'`
			)
		);
	hits = hits.filter((element) => Number(element.hits) > 0);
	const total_hits = hits.map((element) => element.hits).reduce((prev, curr) => prev + curr, 0);
	let features = await knex
		.withSchema(database_name)
		.table("feature_qualifier")
		.whereIn(
			"id",
			hits.map((hit) => hit.id)
		)
		.select();
	const sequence_features = await knex
		.withSchema(database_name)
		.table("sequence_feature")
		.whereIn(
			"sequence_feature.id",
			features.map((feature) => feature.idsequence_feature)
		)
		.select();
	const [sequences, subtypes] = await Promise.all([
		knex
			.withSchema(database_name)
			.table("sequence")
			.whereIn(
				"sequence.id",
				sequence_features.map((seq_feat) => seq_feat.idsequence)
			)
			.select(...fields_sequence),
		knex.withSchema(database_name).table("subtype").select(),
	]);
	const subtypesHash: { [key: number]: any } = hashMapFunction.hashObjectBy(subtypes, "id");
	const dto = { total_hits };
	const hitsHash: { [key: number]: any } = hashMapFunction.hashObjectBy(hits, "id"); //feature qualifiers
	features = features.map((element) => ({ ...element, hits: hitsHash[element.id as number] }));

	for (const sequence of Object.values(sequences)) {
		const local_sequence = { ...sequence };
		local_sequence.subtype = subtypesHash[sequence.id_subtype] ? subtypesHash[sequence.id_subtype].description : "";
		delete local_sequence.id_subtype;
		let local_hits = 0;
		const local_sequence_features = hashMapFunction.hashObjectBy(
			sequence_features
				.filter((element) => Number(element.idsequence) === Number(sequence.id))
				.map((element) => ({ ...element, features: [] })),
			"id"
		);
		for (const feature of features) {
			if (feature.idsequence_feature in local_sequence_features) {
				local_hits += feature.hits.hits;
				const local_feature = { type: feature.name, hits: feature.hits.hits }; // @ts-ignore if we want to send the feature sequence, insert feature.value inside the brackets
				local_sequence_features[feature.idsequence_feature].features.push(local_feature);
			}
		}
		local_sequence.hits = local_hits;
		local_sequence.sequence_features = Object.values(local_sequence_features);
		// @ts-ignore
		dto[sequence.id] = local_sequence;
	}

	//save epitope in db or just return?
	const id_epitope_saved = await knex
		.withSchema(database_name)
		.table("epitope")
		.insert({ linearsequence: linearSequence, count: total_hits })
		.first();
	await knex
		.withSchema(database_name)
		.table("epitope_feature_map")
		.insert(features.map((el) => ({ id_feature: el.id, id_epitope: id_epitope_saved })));

	return Object.values(dto);
};

const select_fields_iedb = {
	bcell: [
		"epitope.epitope_id",
		"bcell.bcell_id",
		// 'epitope.linear_peptide_seq',
		"bcell.as_char_value",
		"bcell.as_immunization_comments",
		"organism_names.name_txt",
		"organism_names.name_class",
	],
	tcell: [
		"epitope.epitope_id",
		"tcell.tcell_id",
		// 'epitope.linear_peptide_seq',
		"tcell.as_char_value",
		"tcell.as_immunization_comments",
		"organism_names.name_txt",
		"organism_names.name_class",
	],
	mhc: [
		"epitope.epitope_id",
		"mhc_bind.mhc_bind_id",
		"epitope.linear_peptide_seq",
		"mhc_bind.as_char_value",
		"mhc_bind.mhc_allele_name",
		"mhc_bind.as_comments",
	],
};

export default {
	getEpitopeInfos: async (req: Request, res: Response) => {
		const { epitope_id = false } = req.body;
		if (!epitope_id) {
			res.send({ status: "error", data: "Please, pass one or more epitopes" });
			return;
		}
		let info = {};
		// if (Array.isArray(epitope_id)) {
		//   for (const id of epitope_id) {//for each epitope id we will get iedb assays infos
		//     info[id] = await getIedbEpitopeAssays(knex, id);
		//   }
		//   info = Object.values(info);
		// } else {
		info = await getIedbEpitopeAssays(epitope_id);
		// }
		res.send({ status: "success", data: info });
	},

	getEpitopeInfosByLinearSequence: async (req: Request, res: Response) => {
		const { database_name = false, linearsequence = false } = req.body;
		if (!database_name) {
			res.send({ status: "error", data: "Database name is missing" });
			return;
		}
		if (!linearsequence) {
			res.send({ status: "error", data: "Linearsequence name is missing" });
			return;
		}

		const epitope_id = await knex
			.withSchema(database_name)
			.table("epitope")
			.where("linearsequence", linearsequence)
			.select()
			.first();

		if (epitope_id) {
			// we have this epitope in our own database?
			const iedb_id = await knex
				.withSchema(database_name)
				.table("epitope_iedb_match")
				.where("id_epitope", epitope_id.id)
				.select("id_iedb_epitope")
				.first();
			if (iedb_id) {
				// if we have in our database, is it paired with iedb?
				const info = await getIedbEpitopeAssays(iedb_id);
				res.send({ status: "success", data: { ...epitope_id, ...info } });
			} else {
				// it dont were paired, but we have this infos
				res.send({ status: "success", data: epitope_id });
			}
		} else {
			// we dont have this epitope, but lets search in local iedb database
			const iedb_id = await knex
				.withSchema("iedb_public")
				.where("epitope.linear_peptide_seq", linearsequence)
				.select("epitope_id")
				.first();
			if (iedb_id) {
				// they have this epitope, this is the data
				const info = await getIedbEpitopeAssays(iedb_id);
				res.send({ status: "success", data: info });
			} else {
				// sorry, we dont know this linearsequence
				res.send({ status: "error", data: "This epitope does not exists in our database" });
			}
		}
	},

	getEpitopeList: async (req: Request, res: Response) => {
		const { database_name } = req.body;
		if (!database_name) {
			res.send({ status: "error", data: "Database name is missing" });
			return;
		}
		const [epitopes, epitope_map] = await Promise.all([
			knex.withSchema(database_name).table("epitope").select(),
			knex.withSchema(database_name).table("epitope_iedb_match").select(),
		]);
		let epitopes_iedb = epitope_map.map((epitope) => epitope.id_iedb_epitope);
		// @ts-ignore
		epitopes_iedb = await getIedbEpitopeAssays(epitopes_iedb);
		// epitopes_iedb is an object wich attributes are the epitopes ids from iedb, now just iterate
		//first creating our database superset
		const dto: any = {};
		epitopes.forEach((epitope) => (dto[epitope.id] = epitope));
		//now feed these epitopes with data from iedb iterating the map object
		for (const map of epitope_map) {
			dto[map.id_epitope] = { ...dto[map.id_epitope], ...epitopes_iedb[map.id_iedb_epitope] };
		}

		res.send({ status: "success", data: Object.values(dto) });
	},

	luciFrequence: async (req: Request, res: Response) => {
		const { database_name = false, linearsequence = false } = req.body;
		if (!database_name) {
			res.send({ status: "error", data: "Database name is missing" });
			return;
		}
		if (!linearsequence) {
			res.send({ status: "error", data: "Linearsequence name is missing" });
			return;
		}
		//first lets check if this epitope is inside our database
		const epitope_id = await knex
			.withSchema(database_name)
			.table("epitope")
			.where("linearsequence", linearsequence)
			.select()
			.first();
		if (epitope_id) {
			// we have this epitope in our own database?
			const iedb_id = await knex
				.withSchema(database_name)
				.table("epitope_iedb_match")
				.where("id_epitope", epitope_id.id)
				.select("id_iedb_epitope")
				.first();
			if (iedb_id) {
				// if we have in our database, is it paired with iedb?
				const info = await getIedbEpitopeAssays(iedb_id);
				res.send({ status: "success", data: { ...epitope_id, ...info } });
			} else {
				// it dont were paired, but we have this infos
				res.send({ status: "success", data: epitope_id });
			}
		} else {
			// we dont have this epitope, but lets search in local iedb database
			const iedb_id = await knex
				.withSchema("iedb_public")
				.where("epitope.linear_peptide_seq", linearsequence)
				.select("epitope_id")
				.first();
			if (iedb_id) {
				// they have this epitope, this is the data
				const info = await getIedbEpitopeAssays(iedb_id);
				res.send({ status: "success", data: info });
			} else {
				// we dont know this linearsequence, lets map it!
				const new_map = await mapNewEpitope(database_name, linearsequence);
				res.send({ status: "success", data: new_map });
			}
		}
	},
};
