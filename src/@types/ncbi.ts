export type EsearchResult = {
	header: {
		type: string;
		version: string;
	};
	esearchresult: {
		count: string;
		retmax: string;
		retstart: string;
		idlist: string[];
		translationset: [
			{
				from: string;
				to: string;
			}
		];
		translationstack: [
			{
				term: string;
				field: string;
				count: string;
				explode: string;
			},
			string
		];
		querytranslation: string;
	};
};
