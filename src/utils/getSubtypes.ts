import { JSDOM } from "jsdom";
import { toChunkArray } from "./hashMapFunctions";

export type strain = {
	name: string;
	url: string;
	ncbi_id: number;
	taxonomy_id?: string;
	type: string | null;
	isGenotype?: boolean;
};

const baseURL = process.env.NCBI_BASE_URL || "https://www.ncbi.nlm.nih.gov";
const apiBaseURL = process.env.NCBI_API_BASE_URL || "https://api.ncbi.nlm.nih.gov/datasets/v2alpha/"; // v1 or v2alpha

export const getPage = async (ncbi_id: number | string) => {
	const data = await fetch(`${baseURL}/Taxonomy/Browser/wwwtax.cgi?id=${ncbi_id}`).then((value) => value.text());
	return new JSDOM(data).window.document;
};
export const getTaxonomyIdFromPage = async (url: string, retries = 0): Promise<string | undefined> => {
	try {
		const data = await fetch(url).then((value) => value.text());
		const dom = new JSDOM(data).window.document;
		const text = dom.querySelector("td[valign=top] > small")?.textContent;
		return text?.split("txid")?.[1]?.replace?.(")", "") || undefined;
	} catch (error) {
		if (retries < 5) {
			await new Promise((resolve) => setTimeout(resolve, 200));
			return getTaxonomyIdFromPage(url, retries + 1);
		}
	}
};
export const getTaxonomyNameFromPage = async (url: string, retries = 0): Promise<string | null> => {
	try {
		const data = await fetch(url).then((value) => value.text());
		const dom = new JSDOM(data).window.document;
		const taxons = ([...dom.querySelectorAll("body > form > a[href*='id=']")] as HTMLAnchorElement[])
			.filter((e) => !e.href?.trim().includes("log_op"))
			?.map((e) => e.textContent?.trim());
		return taxons?.join("; ") || null;
	} catch (error) {
		if (retries < 5) {
			await new Promise((resolve) => setTimeout(resolve, 200));
			return getTaxonomyNameFromPage(url, retries + 1);
		}
		return null;
	}
};

export const getTaxonomyFromApi = async (ncbi_ids: Array<number | string>) => {
	if (!ncbi_ids.length) null;
	const url = `${apiBaseURL}taxonomy/dataset_report`;
	const result = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			taxons: ncbi_ids,
		}),
	})
		.then((r) => r.json())
		.catch((reason) => {
			console.error(reason);
		});
	const hm = ncbi_ids.reduce((acc, curr) => {
		type Report = {
			taxonomy?: {
				tax_id: number;
				rank?: string;
				current_scientific_name?: { name: string };
				group_name?: string;
				classification?: { [key: string]: { name: string } };
				parents?: number[];
				children?: number[];
			};
		};
		const data = result.reports?.find((result: Report) => result?.taxonomy?.tax_id === +curr);
		if (!data) return acc;
		let taxonomy: string | null = null;
		const { classification } = data?.taxonomy || {};
		if (classification) {
			const localClassification = [
				"acellular_root",
				"realm",
				"kingdom",
				"phylum",
				"class",
				"order",
				"family",
				"genus",
				"species",
			]
				.map((field) => classification?.[field]?.name || false)
				.filter(Boolean);
			taxonomy = localClassification.join("; ");
		}
		return {
			...acc,
			[curr]: {
				taxonomy_id: curr,
				rank: data?.taxonomy?.rank || "unknown",
				name: data?.taxonomy?.current_scientific_name?.name || "unknown",
				group: data?.taxonomy?.group_name || "unknown",
				taxonomy: taxonomy || "unknown",
				parents: data?.taxonomy?.parents || [],
				children: data?.taxonomy?.children || [],
			},
		};
	}, {});
	return hm;
};

export const getAssemblyGenomeRefseqs = async (
	ncbi_ids_or_organisms_names: string[] | number[]
): Promise<{ [key: string]: Array<any> }> => {
	let filters = "/dataset_report?";
	filters += "filters.assembly_level=complete_genome";
	filters += "&table_fields=assminfo-accession&table_fields=assminfo-name";
	filters += "&filter.refseq_only=true&filter.annotated_only=true";
	filters += "&page_size=10000";

	const url = `${apiBaseURL}genome/taxon/${ncbi_ids_or_organisms_names.join("%2C")}${filters}`;
	const response = await fetch(url)
		.then((r) => r.json())
		.catch((reason) => {
			console.error(reason);
		});
	const result: { [key: string]: any } = {};
	ncbi_ids_or_organisms_names.forEach((id) => {
		const data = response?.reports?.filter(
			({ organism }: { organism: { tax_id: number } }) => +organism?.tax_id === +id
		);
		if (data.length) result[id] = data;
	});
	return result;
};
export const getRefseqs = async (taxonomy_ids: string[] | number[]): Promise<{ [key: string]: Array<any> }> => {
	let filters = "/dataset_report?";
	filters += "filter.refseq_only=true";
	filters += "&filters.exclude_atypical=true";
	filters += "&filters.assembly_level=complete_genome";
	filters += "&returned_content=ACCESSIONS_ONLY";
	filters += "&table_fields=accession&table_fields=is-annotated&table_fields=is-complete";
	filters += "&page_size=1000";

	const result: { [key: string]: any } = {};
	let retries = 0;
	for (const tax_id of taxonomy_ids) {
		retries = 0;
		const url = `${apiBaseURL}virus/taxon/${tax_id}${filters}`;
		let data;
		while (retries < 5 && !data) {
			try {
				data = await fetch(url)
					.then((r) => r.json())
					.catch((reason) => {
						console.log(reason);
					});
			} catch {
				retries++;
				await new Promise((resolve) => setTimeout(resolve, 200));
			}
		}
		if (data?.reports?.length) {
			result[tax_id] = data?.reports
				?.map(({ accession }: { accession: string }) => accession)
				.filter(Boolean) as string[];
		}
	}
	return result;
};

export const getSubtypes = async (ncbi_id: number | string) => {
	let document = await getPage(ncbi_id);
	const strains: strain[] = [];
	const parentUrl = document.querySelector("a[alt=species]")?.getAttribute("href");
	if (parentUrl) {
		const id = new URL(baseURL + parentUrl).searchParams.get("id") as string;
		document = await getPage(id);
	}
	document.querySelectorAll("li a STRONG").forEach((item) => {
		const name = item.textContent || "";
		const subtypeUrl =
			item.parentElement?.getAttribute("href") ?? item.parentElement?.parentElement?.getAttribute("href");
		const type = item.parentElement?.getAttribute("title") || null;
		const url = `/Taxonomy/Browser/${subtypeUrl?.replace("Tree", "Info") || ""}`;
		const id = new URL(baseURL + url).searchParams.get("id") as string;
		strains.push({ name, url, ncbi_id: +id, type });
	});
	strains.shift(); // remove family
	// shall we include isolate/recombinant/unclassified ?
	// strains = strains.filter((e) => /(geno|sub)type|strain/gi.test(e.name)).sort((a, b) => a.name.localeCompare(b.name));
	const result: { [key: string]: strain } = {};
	const strainChunks = toChunkArray(strains, 5);
	let count = 1;
	for (const chunk of strainChunks) {
		console.log(`getting subtypes taxonomy ids: ${count++} of ${strainChunks.length}`);
		const taxonomy_ids = await Promise.all(chunk.map(({ url }) => getTaxonomyIdFromPage(baseURL + url)));
		for (const [index, taxonomy_id] of taxonomy_ids.entries()) {
			if (!taxonomy_id) continue;
			result[chunk[index].ncbi_id] = {
				...chunk[index],
				isGenotype: /(geno|sub)type/gi.test(chunk[index].name) || chunk[index].type === "genotype",
				taxonomy_id,
			};
		}
	}
	return result;
};
