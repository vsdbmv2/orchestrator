import { io } from "./http";
import { Socket } from "socket.io";
import { Work, taskManager } from "./utils/taskManager";
import { log } from "./utils/helpers";

const clientsWorking: { [key: string]: boolean } = {};

type socketControl = {
	clients: number;
};

const socketControl: socketControl = {
	clients: 0,
};

io.on("connection", async (socket: Socket) => {
	const attributeWork = async (worksAmount: number) => {
		if (taskManager.size === 0 || clientsWorking[socket.id]) return;
		log(`[socket] - getting work for client ${socket.id} at ${socket.handshake.headers["x-real-ip"]}`);
		const work: Work[] = await taskManager.getWork(socket.id, worksAmount);
		if (work.length === 0) return;
		clientsWorking[socket.id] = true;
		socket.emit("work", work);
		log(`[socket] - sent work for client ${socket.id} at ${socket.handshake.headers["x-real-ip"]}`);
	};

	socketControl.clients++;
	log(`[socket] - socket connected, id: ${socket.id}`);
	let server_ts = performance.now();

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
		const size = await taskManager.getWorksLeft();
		const sizeDoing = await taskManager.getDoingSize();
		clientsWorking[socket.id] = false;
		log(`[socket] - works left: ${size} | works doing: ${sizeDoing}`);
		// lidar com o resultado dos possíveis mapeamentos
	});

	socket.on("disconnect", () => {
		socketControl.clients--;
		log(`[socket] - socket disconnected, id ${socket.id}`);
		taskManager.deallocateWork(socket.id);
		clientsWorking[socket.id] = false;
		// clearInterval(ping);
	});
});
