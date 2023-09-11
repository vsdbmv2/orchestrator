import cronController from "./controllers/cronController";
import { server } from "./http";
import "./websocket";
import Routes from "./routes";

const port: number = parseInt(process.env.SV_PORT as string) || 4242;

server.listen(port, async function () {
	console.log(Array(40).fill("\n").join("")); //clear screen
	console.log("Backend running at %s", server.url);
	//starts cron jobs
	cronController.startCronJobs();
});

Routes(server);
