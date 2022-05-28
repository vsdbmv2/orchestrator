export interface IAssay {
	tcell_id?: number;
	result: number;
	comment: string;
	organism_name?: string;
	epitope_id: number;
	iedb_epitope_id: number;
	mhc_id?: number;
	allele_name?: string;
	inequality?: number;
	value?: number;
	bcell_id?: number;
}
