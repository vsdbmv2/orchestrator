export function sortObjectArrayPerKey<T, K extends keyof T>(items: T[], key: K, asc_desc: "ASC" | "DESC") {
	const length = items.length;
	//Number of passes
	for (let i = 0; i < length; i++) {
		//Notice that j < (length - i)
		for (let j = 0; j < length - 1; j++) {
			//Compare the adjacent positions
			if (asc_desc === "ASC") {
				if (items[j][key] > items[j + 1][key]) {
					//Swap the numbers
					const tmp = items[j]; //Temporary variable to hold the current number
					items[j] = items[j + 1]; //Replace current number with adjacent number
					items[j + 1] = tmp; //Replace adjacent number with current number
				}
			} else {
				if (items[j][key] < items[j + 1][key]) {
					//Swap the numbers
					const tmp = items[j]; //Temporary variable to hold the current number
					items[j] = items[j + 1]; //Replace current number with adjacent number
					items[j + 1] = tmp; //Replace adjacent number with current number
				}
			}
		}
	}
	return items;
}
export function sortObjectArrayPerKeyDate<T>(items: T[], key: keyof T, asc_desc: "ASC" | "DESC") {
	return [...items].sort((a: T, b: T) => {
		if (asc_desc === "ASC") {
			if (a[key] instanceof Date) return (a[key] as unknown as Date).getTime() - (b[key] as unknown as Date).getTime();
			return new Date(String(a[key])).getTime() - new Date(String(b[key])).getTime();
		}
		if (a[key] instanceof Date) return (b[key] as unknown as Date).getTime() - (a[key] as unknown as Date).getTime();
		return new Date(String(b[key])).getTime() - new Date(String(a[key])).getTime();
	});
}

// export default {
//     sortObjectArrayPerKey,
//     sortObjectArrayPerKeyDate
// }
