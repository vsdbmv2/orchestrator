import cron from "node-cron";
import knex from "../services/database";
import virusController from "./virusController";
import epitopeDownloader from "../services/EpitopeDownload";
import sequenceController from "./sequenceController";
import { log } from "../utils/helpers";

export const mappingUpdate = async () => {
	const viruses = await knex("virus").select().where({ id: 41 });
	for (const virus of viruses) {
		await sequenceController.scheduleMappingWorks(virus);
	}
	// await EpitopeFinder.find(knex);
	// for (let virus of viruses) {
	//     await epitopeController.pairEpitopesBcellAssays(virus);
	//     await epitopeController.pairEpitopesTcellAssays(virus);
	//     await epitopeController.pairEpitopesMHCAssays(virus);
	// }
	// await sequenceMap.start(knex);
};

const sequenceDBUpdate = async () => {
	log("[cron-job] - | Running process | - Sequence Download");
	const viruses = await knex("virus").select().where({ id: 41 });
	for (const virus of viruses) {
		await virusController.downloadViralSequenceDatabase(virus);
	}
	log("[cron-job] - | Finished process | - Sequence Download");
};

export const downloadEpitopes = async () => {
	log("[cron-job] - | Running process | - Epitope download");
	await epitopeDownloader();
	log("[cron-job] - | Finished process | - Epitope download");
};

export const runJobs = async () => {
	log("[cron-job] - | Running all jobs | - startup");
	// await sequenceDBUpdate();
	await mappingUpdate();
	// await downloadEpitopes();
	log("[cron-job] - | Finished all jobs | - finished");
};

export default {
	async startCronJobs(runJobsNow = false) {
		runJobs();
		if (!runJobsNow) return;
		// 6h
		cron.schedule("0 */2 * * * *", () => mappingUpdate(), { timezone: "America/Sao_Paulo" });
		// 24h
		cron.schedule("0 */24 * * * *", () => sequenceDBUpdate(), { timezone: "America/Sao_Paulo" });
		// 7 dias
		cron.schedule("0 0 * */7 * *", () => downloadEpitopes(), { timezone: "America/Sao_Paulo" });
	},
	mappingUpdate,
	sequenceDBUpdate,
	downloadEpitopes,
};
