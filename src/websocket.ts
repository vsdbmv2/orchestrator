import { io, taskManager } from "./http";
import { Socket } from "socket.io";
import { Work } from "./utils/taskManager";

let clientsWorking: string[] = [];

type socketControl = {
	clients: number;
};

const socketControl: socketControl = {
	clients: 0,
};

io.on("connection", (socket: Socket) => {
	const attributeWork = (worksAmount: number) => {
		if (taskManager.size > 0 && !clientsWorking.includes(socket.id)) {
			console.log(`|> getting work for client ${socket.id} at ${socket.handshake.address} | time: ${Date.now()}`);
			const work: Work[] = taskManager.getWork(socket.id, worksAmount);
			if (work.length > 0) {
				clientsWorking.push(socket.id);
				socket.emit("work", work);
			}
		}
	};

	socketControl.clients++;
	console.log("Socket connected, id: ", socket.id);

	const pong = setInterval(function () {
		socket.emit("pong", { ...socketControl, startTime: Date.now() });
	}, 500);

	socket.on("get-work", ({ worksAmount }) => {
		if (worksAmount && !isNaN(worksAmount)) {
			attributeWork(worksAmount);
		}
	});

	socket.on("work-complete", (payloadWorks: Work[]) => {
		taskManager.finishWork(payloadWorks);
		clientsWorking = clientsWorking.filter((e) => e !== socket.id);
		console.log(`works left: ${taskManager.size} | works doing: ${taskManager.sizeDoing}`);
		// lidar com o resultado dos possíveis mapeamentos
	});

	socket.on("disconnect", () => {
		socketControl.clients--;
		console.log("socket disconnected, id", socket.id);
		taskManager.deallocateWork(socket.id);
		clientsWorking = clientsWorking.filter((e) => e !== socket.id);
		clearInterval(pong);
	});
});
