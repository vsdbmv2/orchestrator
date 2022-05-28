"use strict";
import { exec } from "child_process";

const epitopeDownload = async () => {
	console.log("Started epitope download process");
	try {
		exec("sh ./src/utils/DownloadAndUnpackIEDB.sh", async (error) => {
			if (error !== null) {
				console.log(`exec error: ${error}`);
			} else {
				const today = new Date().toLocaleString();
				console.log(today + " | Cron Job -> | Process finished | - IEDB local instance updated!");
			}
		});
	} catch (error) {
		console.error("error", error);
	}
};

export default epitopeDownload;
