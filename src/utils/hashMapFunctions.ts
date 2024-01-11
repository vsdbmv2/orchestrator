export interface hashMapFunctions {
	hashObjectBy: typeof hashObjectBy;
	hashToArray: typeof hashToArray;
	changeHashKey: typeof changeHashKey;
	toChunkArray: typeof toChunkArray;
}

export function hashObjectBy<T, K extends keyof T>(
	array: T[],
	keyName: K
): {
	[key: string]: T | T[];
} {
	return array.reduce(
		(acc, curr) => {
			if (acc[keyName]) return { ...acc, [keyName]: [acc[keyName], curr] };
			return { ...acc, [keyName]: curr };
		},
		{} as {
			[key in K]: T | T[];
		}
	);
}

export function hashToArray<T extends { [key: string]: any }, K extends keyof T>(hashedObject: T) {
	return Object.keys(hashedObject).map((key) => hashedObject[key]);
}

export function changeHashKey<T extends { [key: string]: any }, K extends keyof T>(
	hashedObject: T,
	newKey: keyof T[K]
) {
	return hashObjectBy(Object.values(hashedObject).flat(), newKey);
}

export function toChunkArray<T>(array: T[], chunk = 5) {
	const tempArray: Array<T[]> = [];
	for (let i = 0, j = array.length; i < j; i += chunk) {
		tempArray.push(array.slice(i, i + chunk));
	}
	return tempArray;
}

export default {
	changeHashKey,
	hashObjectBy,
	hashToArray,
	toChunkArray,
} as hashMapFunctions;
