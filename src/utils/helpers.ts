const formatMemoryUsage = (data: number) => Math.round((data / 1024 / 1024) * 100) / 100;
export const getMemoryUsage = () => {
	const memoryData = process.memoryUsage();
	const memoryUsage = {
		rss: formatMemoryUsage(memoryData.rss), // MB -> Resident Set Size - total memory allocated for the process execution
		heapTotal: formatMemoryUsage(memoryData.heapTotal), //MB -> total size of the allocated heap`,
		heapUsed: formatMemoryUsage(memoryData.heapUsed), //MB -> actual memory used during the execution`,
		external: formatMemoryUsage(memoryData.external), //MB -> V8 external memory`,
	};

	return memoryUsage;
};

export const maxMemory = +(process.env.MAX_MEMORY ?? 2) * 1024;
export const hasReachedMaxMemory = () => getMemoryUsage().rss > 16 * 1024;

export const log = (message: string, virus?: string) => {
	if (message[0] !== "[") {
		if (virus?.length) {
			return console.log(`[${new Date().toLocaleString()}][${virus}] - ${message}`);
		}
		return console.log(`[${new Date().toLocaleString()}] - ${message}`);
	}
	const [header, realMessage] = message.split("] - ");
	if (virus?.length) {
		return console.log(`[${new Date().toLocaleString()}][${header}][${virus}] - ${realMessage}`);
	}
	return console.log(`[${new Date().toLocaleString()}]${header}] - ${realMessage}`);
};
