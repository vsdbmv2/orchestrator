import cron from "node-cron";
import knex from "../services/database";
import virusController from "./virusController";
import epitopeDownloader from "../services/EpitopeDownload";

type cronController = {
	startCronJobs: () => Promise<void>;
	downloadEpitopes: () => void;
	sequenceDBUpdate: () => Promise<void>;
};

export default {
	async startCronJobs(runJobsNow = false) {
		//process 1
		if (!runJobsNow) this.sequenceDBUpdate();
		//24h
		cron.schedule("0 0 */24 * * *", () => this.sequenceDBUpdate());
		//process 2
		if (runJobsNow) this.downloadEpitopes();
		//7 dias
		cron.schedule(`0 0 */${24 * 7} * * *`, () => this.downloadEpitopes());
	},

	downloadEpitopes() {
		const today = new Date();
		console.log(today + " | Cron Job -> | Running process | - Epitope download");
		epitopeDownloader();
	},

	async sequenceDBUpdate() {
		const today = new Date();
		console.log(today + " | Cron Job -> | Running process | - Sequence Download");
		const viruses = await knex("virus").select();
		for (const virus of viruses) {
			// console.log('Downloading sequences for ' + virus.name);
			await virusController.downloadViralSequenceDatabase(virus);
		}
		// await sequenceSubtype.start(knex);
		// await EpitopeFinder.find(knex);
		// for (let virus of viruses) {
		//     await epitopeController.pairEpitopesBcellAssays(virus);
		//     await epitopeController.pairEpitopesTcellAssays(virus);
		//     await epitopeController.pairEpitopesMHCAssays(virus);
		// }
		// await sequenceMap.start(knex);
	},
} as cronController;
