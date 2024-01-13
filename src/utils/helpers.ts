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
