import axios from "axios";
import { xml2json } from "xml-js";
// import { transform } from 'camaro';
import { IViralSequence } from "../@types";
import { IINSDSeq } from "../@types/Sequence.interface";

const { eSearchUrl, eFetchUrl, apiKey } = process.env;

function RemoveJsonTextAttribute(value: any, parentElement: any) {
	try {
		const keyNo = Object.keys(parentElement._parent).length;
		const keyName = Object.keys(parentElement._parent)[keyNo - 1];
		parentElement._parent[keyName] = value;
	} catch (e) {
		throw new Error(e as string);
	}
}

const xmlToJson = (data: string) =>
	JSON.parse(xml2json(data, { compact: true, spaces: 4, textFn: RemoveJsonTextAttribute }));

export default {
	async getGiList(term: string) {
		try {
			const response = await axios.get(eSearchUrl as string, {
				params: { db: "nuccore", term: term, retmode: "json", field: "Accession", api_key: apiKey },
				headers: {
					"content-type": "application/json",
				},
			});

			if (response.status !== 200 || response.data === null) {
				throw new Error("Could not collect sequence id.");
			}
			return response.data;
		} catch (err) {
			//console.log(err);
			throw new Error("Could not collect sequence id.");
		}
	},

	async downloadSingleSequence(accession_version: string) {
		const gi_list = await this.getGiList(accession_version);
		if (gi_list?.esearchresult?.idlist?.length > 0) {
			try {
				const response = await axios.get(eFetchUrl as string, {
					params: {
						db: "nuccore",
						id: gi_list.esearchresult.idlist[0],
						rettype: "gbc",
						retmode: "xml",
						api_key: apiKey,
					},
					headers: {
						"content-type": "application/json",
					},
				});

				if (response.status !== 200 || response.data === null) {
					throw new Error("Could not collect sequence data.");
				}
				return xmlToJson(response.data);
			} catch (err) {
				console.log(err);
				throw new Error("Could not collect sequence data.");
			}
		} else {
			return null;
		}
	},

	async downloadSingleSequenceFromGi(gi: string) {
		try {
			const response = await axios.get(eFetchUrl as string, {
				params: { db: "nuccore", id: gi, rettype: "gbc", retmode: "xml", api_key: apiKey },
				headers: {
					"content-type": "application/json",
				},
			});

			if (response.status !== 200 || response.data === null) {
				throw new Error("Could not collect sequence data.");
			}

			return xmlToJson(response.data);
		} catch (err) {
			console.log(err);
			setTimeout(() => {
				this.downloadSingleSequenceFromGi(gi);
			}, 3520);
			//throw new Error('Could not collect sequence data.');
		}
	},

	async modulateFromINSDSeqToVSDBMSeq(INSDSeq: IINSDSeq) {
		const getGi = () => {
			const seqId = INSDSeq["INSDSeq_other-seqids"]?.INSDSeqid;
			if (typeof seqId === "string") {
				if (seqId?.includes("gi")) return seqId.split("gi|").join("");
			} else if (Array.isArray(seqId)) {
				for (const other_id of seqId) {
					if (other_id.indexOf("gi") > -1) {
						return other_id.split("gi|").join("");
					}
				}
			}
			return INSDSeq["INSDSeq_accession-version"] ?? "";
		};
		const VSDBMSeq_model: IViralSequence = {
			sequence: INSDSeq.INSDSeq_sequence || "",
			accession_version: INSDSeq["INSDSeq_accession-version"] || "",
			locus: INSDSeq.INSDSeq_locus,
			definition: INSDSeq.INSDSeq_definition,
			size: INSDSeq.INSDSeq_sequence ? INSDSeq.INSDSeq_sequence.length : 0,
			gi: getGi(),
			moltype: INSDSeq.INSDSeq_moltype,
			topology: INSDSeq.INSDSeq_topology,
			taxonomy: INSDSeq.INSDSeq_taxonomy,
			country: INSDSeq.INSDSeq_country || "",
			creationDate: (() => {
				const twoDigits = (d: number) => {
					if (0 <= d && d < 10) return "0" + d.toString();
					if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
					return d.toString();
				};
				const convertDateToMysql = (date: Date) =>
					date.getUTCFullYear() +
					"-" +
					twoDigits(1 + date.getMonth()) +
					"-" +
					twoDigits(date.getDate()) +
					" " +
					twoDigits(date.getHours()) +
					":" +
					twoDigits(date.getMinutes()) +
					":" +
					twoDigits(date.getSeconds());
				const date = new Date(INSDSeq["INSDSeq_create-date"]);
				return convertDateToMysql(date);
			})(),
			// idbiosample: (() => {
			//     if (INSDSeq && INSDSeq.INSDSeq_xrefs && INSDSeq.INSDSeq_xrefs.INSDXref && INSDSeq.INSDSeq_xrefs.INSDXref.INSDXref_dbname && INSDSeq.INSDSeq_xrefs.INSDXref.INSDXref_dbname === "BioProject") {
			//         return INSDSeq.INSDSeq_xrefs.INSDXref.INSDXref_id || '';
			//     }
			//     return '';
			// })(),
			idbiosample: INSDSeq.INSDSeq_project || "",
			pubmed_id: (() => {
				if (INSDSeq && INSDSeq.INSDSeq_references && INSDSeq.INSDSeq_references.INSDReference) {
					if (Array.isArray(INSDSeq.INSDSeq_references.INSDReference)) {
						for (const ref of INSDSeq.INSDSeq_references.INSDReference) {
							if (ref.INSDReference_pubmed) {
								return ref.INSDReference_pubmed;
							}
						}
					} else {
						const ref = INSDSeq.INSDSeq_references.INSDReference;
						if (ref.INSDReference_pubmed) {
							return ref.INSDReference_pubmed;
						}
					}
				}
				return "";
			})(),
		};
		const features = [];
		if (INSDSeq["INSDSeq_feature-table"].INSDFeature && !Array.isArray(INSDSeq["INSDSeq_feature-table"].INSDFeature)) {
			INSDSeq["INSDSeq_feature-table"].INSDFeature = [INSDSeq["INSDSeq_feature-table"].INSDFeature];
		} else if (!INSDSeq["INSDSeq_feature-table"]?.INSDFeature) {
			INSDSeq["INSDSeq_feature-table"].INSDFeature = [];
		}
		for (const feature of INSDSeq["INSDSeq_feature-table"].INSDFeature) {
			const feat_limits = this.handleFeatureLocations(feature.INSDFeature_intervals.INSDInterval);
			const feat_model = {
				feature_key: feature.INSDFeature_key,
				feature_init: feat_limits[0],
				feature_end: feat_limits[1],
				qualifiers: (() => {
					if (feature.INSDFeature_quals && feature.INSDFeature_quals.INSDQualifier) {
						if (
							!Array.isArray(feature.INSDFeature_quals.INSDQualifier) &&
							typeof feature.INSDFeature_quals.INSDQualifier === "object"
						) {
							const mod = {
								name: feature.INSDFeature_quals.INSDQualifier.INSDQualifier_name,
								value: feature.INSDFeature_quals.INSDQualifier.INSDQualifier_value,
							};
							if (mod.name === "country") {
								VSDBMSeq_model.country = mod.value;
							}
							return [mod];
						} else if (Array.isArray(feature.INSDFeature_quals.INSDQualifier)) {
							return feature.INSDFeature_quals.INSDQualifier.map((qualifier: any) => {
								const mod = {
									name: qualifier.INSDQualifier_name,
									value: qualifier.INSDQualifier_value,
								};
								if (mod.name === "country") {
									VSDBMSeq_model.country = mod.value;
								}

								return mod;
							});
						} else {
							return [];
						}
					}

					return [];
				})(),
			};

			features.push(feat_model);
		}

		VSDBMSeq_model.features = features;

		return VSDBMSeq_model;
	},

	async getOrganismName(accession_version: string) {
		const gi_list = await this.getGiList(accession_version);
		if (gi_list && gi_list.esearchresult && gi_list.esearchresult.idlist && gi_list.esearchresult.idlist.length > 0) {
			try {
				const response = await axios.get(eFetchUrl as string, {
					params: {
						db: "nuccore",
						id: gi_list.esearchresult.idlist[0],
						rettype: "gb",
						retmode: "xml",
						api_key: apiKey,
					},
					headers: {
						"content-type": "application/json",
					},
				});

				if (response.status !== 200 || response.data === null) {
					throw new Error("Could not collect sequence data.");
				}

				const seq = xmlToJson(response.data);

				if (seq?.GBSet?.GBSeq?.GBSeq_organism) {
					if (seq.GBSet.GBSeq.GBSeq_organism.indexOf(" virus") > -1) {
						return seq.GBSet.GBSeq.GBSeq_organism.split(" virus")[0] + " virus";
					} else {
						return seq.GBSet.GBSeq.GBSeq_organism;
					}
				} else {
					return "";
				}
			} catch (err) {
				console.log(err);
				throw new Error("Could not collect sequence data.");
			}
		} else {
			return null;
		}
	},

	async getGiListFromOrganismName(term: string) {
		try {
			const response = await axios.get(eSearchUrl as string, {
				params: { db: "nuccore", term: term, retmode: "json", field: "Organism", api_key: apiKey, retmax: 10000000 }, //10kk max
				headers: {
					"content-type": "application/json",
				},
			});

			if (response.status !== 200 || response.data === null) {
				throw new Error("Could not collect sequence id.");
			}
			return response.data;
		} catch (err) {
			console.log(err);
			throw new Error("Could not collect sequence id.");
		}
	},

	handleFeatureLocations(data: any | any[]) {
		if (Array.isArray(data) && data.length > 1) {
			const inits = [];
			const ends = [];
			for (const location of data) {
				inits.push(Number(location.INSDInterval_from));
				ends.push(Number(location.INSDInterval_to));
			}
			const retorno = [Math.min(...inits), Math.max(...ends)];
			if (Number.isNaN(retorno[0])) {
				retorno[0] = 0;
			}
			if (Number.isNaN(retorno[1])) {
				retorno[1] = 0;
			}
			return retorno;
		} else if (Array.isArray(data) && data.length === 1) {
			const retorno = [Number(data[0]?.INSDInterval_from), Number(data[0]?.INSDInterval_to)];
			if (Number.isNaN(retorno[0])) {
				retorno[0] = 0;
			}
			if (Number.isNaN(retorno[1])) {
				retorno[1] = 0;
			}
			return retorno;
		} else if (typeof data === "object") {
			const retorno = [Number(data?.INSDInterval_from), Number(data?.INSDInterval_to)];
			if (Number.isNaN(retorno[0])) {
				retorno[0] = 0;
			}
			if (Number.isNaN(retorno[1])) {
				retorno[1] = 0;
			}
			return retorno;
		} else {
			return [0, 0];
		}
	},
};
