import restify from "restify";
import corsMiddleware from "restify-cors-middleware";
import TaskManager from "./utils/taskManager";
import { Server } from "socket.io";
import { refSeq, seq, epitopes } from "./utils/TestSequences";

const taskManager = new TaskManager();
// testing with some works

for (let i = 0; i < 50; i++) {
	taskManager.registerWork("global-mapping", refSeq, i, seq, 1);
	taskManager.registerWork("local-mapping", refSeq, i, seq, 1);
	taskManager.registerWork("epitope-mapping", i % 2 === 0 ? refSeq : seq, i, epitopes);
}

const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: ["*"],
	allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
	exposeHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
});

//configure server name and version
const server = restify.createServer({
	name: "vsdbm v2",
	version: "0.1",
});

const io = new Server(server.server, {
	cors: {
		origin: "*",
	},
});

//configure cors
server.pre(cors.preflight);
server.use(cors.actual);

//configure restify
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

export { server, io, taskManager };
