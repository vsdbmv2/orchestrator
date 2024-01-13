/* eslint-disable @typescript-eslint/no-namespace */
import express from "express";
import cors from "cors";
// import TaskManager, { taskManager } from "./utils/taskManager";
import http from "http";
import { Server } from "socket.io";
// import { refSeq, seq, epitopes } from "./utils/TestSequences";

import epitopeRoutes from "./routes/epitopeRoutes";
import frontendRoutes from "./routes/frontendRoutes";
import loginRoutes from "./routes/loginRoutes";
import sequenceRoutes from "./routes/sequenceRoutes";
import userRoutes from "./routes/userRoutes";
import virusRoutes from "./routes/virusRoutes";

// const taskManager = new TaskManager();
// testing with some works

// for (let i = 0; i < 50; i++) {
// taskManager.registerWork("global-mapping", refSeq, i, seq, 1);
// 	taskManager.registerWork("local-mapping", refSeq, i, seq, 1);
// 	taskManager.registerWork("epitope-mapping", i % 2 === 0 ? refSeq : seq, i, epitopes);
// }
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: number;
				email: string;
				context: string;
				created_at: string;
				password?: string;
				[key: string]: any;
			};
		}
	}
}
//configure server name and version
const app = express();
const server = http.createServer(app);

app.use(
	cors({
		origin: "*",
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
		exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
	})
);
app.use(express.json());

app.use(epitopeRoutes);
app.use(frontendRoutes);
app.use(loginRoutes);
app.use(sequenceRoutes);
app.use(userRoutes);
app.use(virusRoutes);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

export { server, io };
