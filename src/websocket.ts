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

io.on("connection", (socket: Socket) => {
	const attributeWork = (worksAmount: number) => {
		if (taskManager.size === 0 || clientsWorking.includes(socket.id)) return;
		log(`[socket] - getting work for client ${socket.id} at ${socket.handshake.address}`);
		const work: Work[] = taskManager.getWork(socket.id, worksAmount);
		if (work.length === 0) return;
		clientsWorking.push(socket.id);
		socket.emit("work", work);
	};

	socketControl.clients++;
	log(`[socket] - socket connected, id: ${socket.id}`);

	const ping = setInterval(function () {
		socket.emit("ping", { ...socketControl, startTime: Date.now() });
	}, 500);

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
		clearInterval(ping);
	});
});
