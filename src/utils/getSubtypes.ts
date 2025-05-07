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

export const scrapeTaxonomyPage2 = async (document: Document) => {
	// In a real implementation, we would fetch the page here
	// For demonstration, we'll assume we're already on the relevant page

	// Extract the scientific name
	const scientificName = document.querySelector("h1")?.textContent?.trim() || "";

	// Find the children/subtypes table
	// This requires understanding the specific structure of the NCBI Taxonomy Browser
	const childrenSection = Array.from(document.querySelectorAll("h2, h3, h4")).find(
		(header) =>
			header.textContent?.includes("Direct") ||
			header.textContent?.includes("Children") ||
			header.textContent?.includes("Subtypes")
	);

	let childrenTable = null;
	if (childrenSection) {
		// Find the table after this header
		let currentElement = childrenSection.nextElementSibling;
		while (currentElement) {
			if (currentElement.tagName === "TABLE") {
				childrenTable = currentElement;
				break;
			}
			currentElement = currentElement.nextElementSibling;
		}
	}

	// If we couldn't find the table by header, try looking for the table directly
	// NCBI often has a table with specific characteristics for child taxonomies
	if (!childrenTable) {
		const tables = document.querySelectorAll("table");
		for (const table of tables) {
			// Look for tables with taxon links and rank information
			if (
				table.querySelector('a[href*="id="]') &&
				(table.textContent?.includes("species") ||
					table.textContent?.includes("genotype") ||
					table.textContent?.includes("isolate"))
			) {
				childrenTable = table;
				break;
			}
		}
	}

	// Extract child taxa
	const children = [];
	if (childrenTable) {
		const rows = childrenTable.querySelectorAll("tr");

		for (const row of rows) {
			// Skip header rows
			if (row.querySelector("th")) continue;

			// Look for taxonomy links
			const link = row.querySelector("a[href*=\"id=\"]");
			if (link) {
				const href = link.getAttribute("href");
				const childTaxId = href?.match(/id=(\d+)/)?.[1];
				let childName = link.textContent?.trim();

				// Sometimes NCBI has additional information in brackets that we may want to clean
				childName = childName?.replace(/\s+\[.*\]$/, "");

				if (childTaxId && childName) {
					children.push({
						name: childName,
						taxId: childTaxId,
					});
				}
			}
		}
	}

	return {
		name: scientificName,
		// taxId,
		children,
	};
};

export const scrapeTaxonomyPage = async (document: Document) => {
	const results = [];
	// Use the main species Tax ID as requested in the example output format

	// Find the specific species list item using its unique tax ID in the link
	const speciesListItem = document.querySelector("ul > li > a");
	if (!speciesListItem) return [];
	const speciesLiElement = speciesListItem.closest("li");
	const mainList = speciesLiElement ? speciesLiElement.querySelector(":scope > ul") : null;

	if (!mainList) {
		console.error("Could not find the main taxonomy list UL element under Hepacivirus hominis.");
		return [];
	}

	// Get all direct children LI elements under the main list
	const topLevelListItems = mainList.querySelectorAll(":scope > li");

	topLevelListItems.forEach((itemLi) => {
		const topLevelLink = itemLi.querySelector(":scope > a");
		if (!topLevelLink) return; // Skip if no direct link in the LI

		const topLevelName = topLevelLink.textContent?.trim().replace(/\s+/g, " ");
		const mainTaxId = topLevelLink.getAttribute("href")?.match(/id=(\d+)/)?.[1] || null;

		const genotypeData = {
			genotype: topLevelName,
			taxId: mainTaxId, // Assign the main species ID here
			subtypes: [],
		};

		// 1. Find ALL descendant list items marked with type="square" within this top-level LI
		const subtypeSquareLIs = itemLi.querySelectorAll('li[type="square"]');

		subtypeSquareLIs.forEach((subLi) => {
			const subLink = subLi.querySelector(":scope > a"); // Get the link directly under the square li
			if (!subLink) return;

			// Prefer text within a <strong> tag inside the link if it exists
			const subNameElement = subLink.querySelector("strong") || subLink;
			const subName = subNameElement.textContent.trim().replace(/\s+/g, " ");
			const href = subLink.getAttribute("href");
			let subTaxId = null;

			if (href) {
				const match = href.match(/id=(\d+)/);
				if (match && match[1]) {
					subTaxId = match[1];
				}
			}

			if (subName && subTaxId) {
				// Check for duplicates based on taxId before adding
				if (!genotypeData.subtypes.some((s) => s.taxId === subTaxId)) {
					genotypeData.subtypes.push({ name: subName, taxId: subTaxId });
				}
			}
		});

		// 2. Check if the top-level LI itself is a square (a leaf node in this context)
		if (itemLi.getAttribute("type") === "square") {
			const href = topLevelLink.getAttribute("href");
			let specificTaxId = null;
			if (href) {
				const match = href.match(/id=(\d+)/);
				if (match && match[1]) {
					specificTaxId = match[1];
				}
			}
			if (topLevelName && specificTaxId) {
				// Add itself as a subtype if it's a square LI directly under the main list
				// Avoid duplicates if somehow already added (shouldn't happen with this logic)
				if (!genotypeData.subtypes.some((s) => s.taxId === specificTaxId)) {
					genotypeData.subtypes.push({
						name: topLevelName,
						taxId: specificTaxId,
					});
				}
			}
		}

		// Add the extracted data for this group to the results array
		// Only add if it has subtypes or if it was a square node itself
		if (genotypeData.subtypes.length > 0) {
			results.push(genotypeData);
		}
	});

	return results;
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
export const getRefseqs = async (
	taxonomy_ids: string[] | number[],
	isGenotype = true
): Promise<{ [key: string]: Array<any> }> => {
	let filters = "/dataset_report?";
	if (isGenotype) filters += "filter.refseq_only=true";
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
	let strains: strain[] = [];
	const data = await scrapeTaxonomyPage(document);
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
	const bad = strains.filter((e) => !/(geno|sub)type|strain|recombinant/gi.test(e.name));
	strains = strains
		.filter((e) => /(geno|sub)type|strain|recombinant/gi.test(e.name))
		.sort((a, b) => a.name.localeCompare(b.name));
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
