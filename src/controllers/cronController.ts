import cron from "node-cron";
import knex from "../services/database";
import virusController from "./virusController";
import epitopeDownloader from "../services/EpitopeDownload";
import sequenceController from "./sequenceController";
import { log } from "../utils/helpers";

type cronController = {
	startCronJobs: () => Promise<void>;
	downloadEpitopes: () => void;
	sequenceDBUpdate: () => Promise<void>;
	mappingUpdate: () => Promise<void>;
};

export default {
	async startCronJobs(runJobsNow = false) {
		//process 1
		if (!runJobsNow) this.sequenceDBUpdate();
		//6h
		cron.schedule("0 */2 * * * *", () => this.mappingUpdate(), { timezone: "America/Sao_Paulo" });
		//24h
		cron.schedule("0 */24 * * * *", () => this.sequenceDBUpdate(), { timezone: "America/Sao_Paulo" });
		//process 2
		if (!runJobsNow) this.downloadEpitopes();
		//7 dias
		cron.schedule("0 0 * */7 * *", () => this.downloadEpitopes(), { timezone: "America/Sao_Paulo" });
	},

	downloadEpitopes() {
		log("[cron-job] - | Running process | - Epitope download");
		epitopeDownloader();
	},

	async mappingUpdate() {
		const viruses = await knex("virus").select();
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
	},

	async sequenceDBUpdate() {
		log("[cron-job] - | Running process | - Sequence Download");
		const viruses = await knex("virus").select();
		for (const virus of viruses) {
			await virusController.downloadViralSequenceDatabase(virus);
		}
	},
} as cronController;
