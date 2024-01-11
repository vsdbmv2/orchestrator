import { JSDOM } from "jsdom";

export type strain = { name: string; url: string; ncbi_id: number };

const baseURL = "http://www.ncbi.nlm.nih.gov";
const apiBaseURL = "https://api.ncbi.nlm.nih.gov/datasets/v2alpha/"; // v1 or v2alpha

const getPage = async (ncbi_id: number | string) => {
	const data = await fetch(`${baseURL}/Taxonomy/Browser/wwwtax.cgi?id=${ncbi_id}`).then((value) => value.text());
	// const data = (await axios.get(`${baseURL}/Taxonomy/Browser/wwwtax.cgi?id=${ncbi_id}`)).data as string;
	return new JSDOM(data).window.document;
};

export const getRefseqs = async (ncbi_ids: string[] | number[]): Promise<{ [key: string]: Array<{}> }> => {
	let filters = "/dataset_report?";
	filters += "filters.assembly_level=complete_genome";
	filters += "&table_fields=assminfo-accession&table_fields=assminfo-name";
	filters += "&page_size=1000";

	const url = `${apiBaseURL}genome/taxon/${ncbi_ids.join("%2C")}${filters}`;
	const test = await fetch(url)
		.then((r) => r.json())
		.catch((reason) => {
			console.log(reason);
		});
	const result: { [key: string]: any } = {};
	ncbi_ids.forEach((id) => {
		const data = test?.reports?.filter(({ organism }: { organism: { tax_id: number } }) => +organism?.tax_id === +id);
		if (data.length) result[id] = data;
	});
	return result;
	// return Promise.all(ncbi_ids.map(async (id) => getRefseq(id)));
};

export const getSubtypes = async (ncbi_id: number | string) => {
	let document = await getPage(ncbi_id);
	let strains: strain[] = [];
	const parentUrl = document.querySelector("a[alt=species]")?.getAttribute("href");
	if (parentUrl) {
		const id = new URL(baseURL + parentUrl).searchParams.get("id") as string;
		document = await getPage(id);
	}
	document.querySelectorAll("li a STRONG").forEach((item) => {
		const name = item.textContent || "";
		const subtypeUrl =
			item.parentElement?.getAttribute("href") ?? item.parentElement?.parentElement?.getAttribute("href");
		const url = `/Taxonomy/Browser/${subtypeUrl?.replace("Tree", "Info") || ""}`;
		const id = new URL(baseURL + url).searchParams.get("id") as string;
		strains.push({ name, url, ncbi_id: +id });
	});
	// shall we include isolate/recombinant/unclassified ?
	strains = strains.filter((e) => /(geno|sub)type|strain/gi.test(e.name)).sort((a, b) => a.name.localeCompare(b.name));
	const result: { [key: string]: strain } = {};
	strains.forEach((strain) => {
		result[strain.ncbi_id] = strain;
	});
	return result;
};
