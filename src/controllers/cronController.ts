import cron from "node-cron";
import knex from "../services/database";
import virusController from "./virusController";
import epitopeDownloader from "../services/EpitopeDownload";
import sequenceController from "./sequenceController";

type cronController = {
	startCronJobs: () => Promise<void>;
	downloadEpitopes: () => void;
	sequenceDBUpdate: () => Promise<void>;
};

export default {
	async startCronJobs(runJobsNow = false) {
		//process 1
		if (!runJobsNow) this.sequenceDBUpdate();
		//6h
		cron.schedule("0 */2 * * * *", () => this.sequenceDBUpdate());
		//24h
		cron.schedule("0 */24 * * * *", () => this.sequenceDBUpdate());
		//process 2
		if (runJobsNow) this.downloadEpitopes();
		//7 dias
		cron.schedule("0 0 * * 0 *", () => this.downloadEpitopes());
	},

	downloadEpitopes() {
		const today = new Date();
		console.log(today + " | Cron Job -> | Running process | - Epitope download");
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
		const today = new Date();
		console.log(today + " | Cron Job -> | Running process | - Sequence Download");
		const viruses = await knex("virus").select();
		for (const virus of viruses) {
			await virusController.downloadViralSequenceDatabase(virus);
		}
	},
} as cronController;
