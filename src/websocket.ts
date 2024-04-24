import { io } from "./http";
import { Socket } from "socket.io";
import { Work, taskManager } from "./utils/taskManager";
import { log } from "./utils/helpers";

let clientsWorking: string[] = [];

type socketControl = {
	clients: number;
};

const socketControl: socketControl = {
	clients: 0,
};

io.on("connection", async (socket: Socket) => {
	const attributeWork = async (worksAmount: number) => {
		if (taskManager.size === 0 || clientsWorking.includes(socket.id)) return;
		log(`[socket] - getting work for client ${socket.id} at ${socket.handshake.address}`);
		const work: Work[] = await taskManager.getWork(socket.id, worksAmount);
		if (work.length === 0) return;
		clientsWorking.push(socket.id);
		socket.emit("work", work);
	};

	socketControl.clients++;
	log(`[socket] - socket connected, id: ${socket.id}`);

	// const ping = setInterval(function () {
	// 	socket.emit("ping", { ...socketControl, startTime });
	// }, 500);
	let server_ts = performance.now();
	// let startTime = new Date().getTime();
	// let ping = 0;
	// socket.emit("ping", { ...socketControl, startTime: server_ts, ping });
	// socket.on("pong", async ({ startTime: oldStartTime }: { startTime: number }) => {
	// 	server_ts = new Date().getTime();
	// 	ping = Math.ceil((server_ts - oldStartTime) / 2);
	// 	if (ping >= 500) return socket.emit("ping", { ...socketControl, startTime: server_ts, ping });
	// 	const wait = Math.abs(500 - ping);
	// 	await new Promise((resolve) => setTimeout(resolve, wait));
	// 	socket.emit("ping", { ...socketControl, startTime: server_ts, ping });
	// });
	socket.emit("ping", { ...socketControl, server_ts });
	socket.on("pong", async (payload: { server_ts: number; client_ts: number }) => {
		server_ts = performance.now();
		socket.emit("ping", {
			...socketControl,
			server_ts,
			client_ts: payload.client_ts,
			server_ack_ts: server_ts,
		});
	});

	socket.on("get-work", ({ worksAmount }) => {
		if (worksAmount && !isNaN(worksAmount) && worksAmount !== null) attributeWork(worksAmount);
	});

	socket.on("work-complete", async (payloadWorks: Work[]) => {
		await taskManager.finishWork(payloadWorks);
		clientsWorking = clientsWorking.filter((e) => e !== socket.id);
		log(`[socket] - works left: ${taskManager.size} | works doing: ${taskManager.sizeDoing}`);
		// lidar com o resultado dos possíveis mapeamentos
	});

	socket.on("disconnect", () => {
		socketControl.clients--;
		log(`[socket] - socket disconnected, id ${socket.id}`);
		taskManager.deallocateWork(socket.id);
		clientsWorking = clientsWorking.filter((e) => e !== socket.id);
		// clearInterval(ping);
	});
});
