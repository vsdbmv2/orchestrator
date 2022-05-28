// import { toChunkArray } from "./utils/hashMapFunctions";
// import { strain } from "./utils/getSubtypes";
// import getProteins from './utils/getProteinsINSD';
// import { getSubtypes, getRefseqs } from './utils/getSubtypes';
("use strict");
import dotenv from "dotenv";
import cronController from "./controllers/cronController";
import { server } from "./http";
import "./websocket";
import Routes from "./routes";

dotenv.config();

const port: number = parseInt(process.env.SV_PORT as string) || 4242;

server.listen(port, async function () {
	console.log(Array(40).fill("\n").join("")); //clear screen
	console.log("Backend running at %s", server.url);
	//starts cron jobs
	cronController.startCronJobs();
});

Routes(server);
