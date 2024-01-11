import dotenv from "dotenv";
import cronController from "./controllers/cronController";
import { server } from "./http";
import "./websocket";

dotenv.config();

const port: number = parseInt(process.env.SV_PORT as string) || 4242;

server.listen(port, async function () {
	console.clear();
	console.log(`Backend running at http://localhost:${port}`);
	//starts cron jobs
	cronController.startCronJobs();
});
