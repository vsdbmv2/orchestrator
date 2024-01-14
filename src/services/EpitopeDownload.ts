"use strict";
import { exec } from "child_process";
import { log } from "../utils/helpers";

const epitopeDownload = async () => {
	log("[iedb-update] - started epitope download process");
	try {
		exec("sh ./src/utils/DownloadAndUnpackIEDB.sh", async (error) => {
			if (error !== null) return log(`exec error: ${error}`);
			log("[cron-job] - | Process finished | - IEDB local instance updated!");
		});
	} catch (error) {
		console.error("error", error);
	}
};

export default epitopeDownload;
