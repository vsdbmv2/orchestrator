import getProteins from "./src/utils/getProteinsINSD";
import { writeFileSync } from "node:fs";
import { getSubtypes, getRefseqs } from "./src/utils/getSubtypes";

// console.log("┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐");
// console.log("├──────────────────────────────────────────────── HCV ────────────────────────────────────────────────┤");
// console.table(getProteins("sequence-hcv.gbc.xml"));
// console.log("├──────────────────────────────────────────────── ZKV ────────────────────────────────────────────────┤");
// console.table(getProteins("sequence-zkv.gbc.xml"));
// console.log("└─────────────────────────────────────────────────────────────────────────────────────────────────────┘");
const main = async () => {
	const subtypes = await getSubtypes(11103);
	const accessions = await getRefseqs(Object.keys(subtypes));
	const mutatedSubtypes = Object.entries(accessions)
		.map(([key, value]) => {
			if (subtypes[key]) {
				return {
					...subtypes[key],
					accessions: value,
				};
			}
		})
		.filter(Boolean);

	await writeFileSync("subtypes with accessions.json", JSON.stringify(mutatedSubtypes));
	console.table({ subtypes });
};

main();
