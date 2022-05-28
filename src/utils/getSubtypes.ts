import { JSDOM } from "jsdom";
import axios from "axios";
import puppeteer, { Browser } from "puppeteer";

export type strain = { name: string; url: string };

const baseURL = "http://www.ncbi.nlm.nih.gov";

const getPage = async (ncbi_id: number | string) => {
	const data = (await axios.get(`${baseURL}/Taxonomy/Browser/wwwtax.cgi?id=${ncbi_id}`)).data as string;
	return new JSDOM(data).window.document;
};

const getRefseq = async (browser: Browser, url: string) => {
	if (!url) {
		return false;
	}
	console.log(`calling ${baseURL}${url}`);
	const page = await browser.newPage();
	await page.goto(baseURL + url);
	// await page.waitForNavigation({ waitUntil: 'networkidle0' });
	await page.waitForSelector(`table td > a[href*="${"nuccore"}"]`);
	const urls = await page.$$(`table td > a[href*="${"nuccore"}"]`);
	console.log(urls.length);
	if (urls.length > 1) {
		console.log("Genotype");
		await page.close();
		return false;
		await urls[1].click();
	} else {
		console.log("Strain");
		await urls[0].click();
	}
	console.log("page loading");
	await page.waitForSelector(".rprtheader>.itemid");
	console.log("page loaded");
	const refseq = await page.evaluate(async () => {
		const refseq = document?.querySelector(".rprtheader>.itemid")?.textContent;
		return new Promise((resolve) => resolve(refseq));
	});
	await page.close();
	if (refseq) {
		return refseq as string;
	}
	return false;
};

export const getRefseqs = async (urls: string[]): Promise<Array<string | boolean>> => {
	const browser = await puppeteer.launch({ headless: false });
	const refseqs = [];
	for (const url of urls) {
		refseqs.push(await getRefseq(browser, url));
	}
	await browser.close();
	return refseqs;
	const subtypes = await Promise.all(urls.map(async (url) => getRefseq(browser, url)));
	return subtypes;
};

export const getSubtypes = async (ncbi_id: number | string) => {
	const document = await getPage(ncbi_id);
	let strains: strain[] = [];
	document.querySelectorAll("STRONG").forEach((item) => {
		const name = item.textContent || "";
		const url = `/Taxonomy/Browser/${item.parentElement?.getAttribute("href")?.replace("Tree", "Info") || ""}`;
		strains.push({ name, url });
	});
	strains = strains.filter((e) => /(geno|sub)type|strain/gi.test(e.name));
	return strains;
};
