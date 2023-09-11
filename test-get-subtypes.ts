import getProteins from "./src/utils/getProteinsINSD";
import { getSubtypes, getRefseqs } from "./src/utils/getSubtypes";

console.log("┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐");
console.log("├──────────────────────────────────────────────── HCV ────────────────────────────────────────────────┤");
console.table(getProteins("sequence-hcv.gbc.xml"));
console.log("├──────────────────────────────────────────────── ZKV ────────────────────────────────────────────────┤");
console.table(getProteins("sequence-zkv.gbc.xml"));
console.log("└─────────────────────────────────────────────────────────────────────────────────────────────────────┘");
const subtypes = await getSubtypes(11103);
const accessions = await getRefseqs(Object.keys(subtypes));
Object.entries(accessions).forEach(([key, value]) => {
	if (subtypes[key]) {
		subtypes[key] = {
			...subtypes[key],
			accessions: value,
		};
	}
});
await Bun.write("subtypes with accessions.json", JSON.stringify(subtypes));
console.table({ subtypes });
