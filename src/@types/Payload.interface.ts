export interface IEpitopeMap {
	linearsequence: string;
	init_pos: number;
}

export interface IPayloadGeneric {
	// idsequence: number | undefined;
	map_init: number;
	map_end: number;
	coverage_pct: number;
	alignment_score: number;
	epitope_maps: IEpitopeMap[];
}
// https://www.typescriptlang.org/docs/handbook/utility-types.html

export type IPayloadGlobalAlignment = Omit<IPayloadGeneric, "alignment_score" | "epitope_maps">;
export type IPayloadLocalAlignment = Pick<IPayloadGeneric, "alignment_score">;
export type IPayloadEpitopeMap = Pick<IPayloadGeneric, "epitope_maps">;
