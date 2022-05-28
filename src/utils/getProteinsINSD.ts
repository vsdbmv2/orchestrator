import { DOMParser } from "xmldom";
import xpath from "xpath";
import fs from "fs";
import path from "path";

interface ILocation {
	from: number;
	to: number;
}

interface IProtein {
	name: string;
	location: ILocation | ILocation[];
}

const getProtein = (value: Node): IProtein | null => {
	const XPathName = xpath.select(
		".//INSDQualifier_name[text()='product']/following-sibling::INSDQualifier_value/text()[1]",
		value
	);
	const nameNode = XPathName[0] as Node;
	const name = nameNode?.textContent || false;
	const XPathLocation = xpath.select(".//INSDFeature_location/text()[1]", value);
	const locNode = XPathLocation[0] as Node;
	const locText = locNode?.textContent || false;
	let location: ILocation | ILocation[] | undefined;
	if (typeof locText === "string" && locText.includes("join")) {
		const paths = locText.split("(")[1].split(")")[0].split(",");
		location = paths.map((elem) => {
			const data = elem.split("..");
			return { from: Number(data[0]), to: Number(data[1]) };
		});
	} else if (typeof locText === "string") {
		const paths = locText.split("..").map((e) => Number(e));
		location = { from: paths[0], to: paths[1] };
	}
	if (name && typeof location !== "undefined") {
		return { location, name };
	} else {
		return null;
	}
};

export const getProteins = (xml: XMLDocument) => {
	const result = xpath.select("//INSDFeature", xml);
	const values: IProtein[] = [];
	if (typeof result !== "undefined") {
		result.forEach((value: xpath.SelectedValue) => {
			if (value) {
				const protein = getProtein(value as Node);
				if (protein) {
					values.push(protein);
				}
			}
		});
		return values;
	}
	return values;
};

export const getDocument = (name: string): XMLDocument => {
	const file = fs.readFileSync(path.resolve(__dirname, "..", "..", name), { encoding: "utf8" });
	const parser = new DOMParser();
	return parser.parseFromString(file, "text/xml");
};

export const get = (name: string): IProtein[] => {
	const document: XMLDocument = getDocument(name);
	const data = getProteins(document);
	return data;
};

export default get;
