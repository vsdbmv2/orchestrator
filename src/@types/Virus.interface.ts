export interface IVirus {
	id: number;
	name: string;
	reference_accession: string;
	database_name: string;
	latest_update?: string;
	created_at?: string;
}

export interface IViralSequence {
	id?: number;
	sequence: string;
	accession_version: string;
	locus?: string;
	definition?: string;
	size?: number;
	gi?: number;
	moltype?: string;
	topology?: string;
	taxonomy?: string;
	country?: string;
	creationDate?: string;
	idbiosample?: string;
	pubmed_id?: string;
	id_subtype?: number;
	subtype_score?: number;
	map_init?: number;
	map_end?: number;
	coverage_pct?: number;
	features?: any[];
}

export interface IFeatureQualifier {
	id: number;
	idsequence_feature: number;
	name: string;
	value: string;
	visited: number;
}
