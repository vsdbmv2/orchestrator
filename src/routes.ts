import EpitopeRoutes from "./routes/epitopeRoutes";
import UserRoutes from "./routes/userRoutes";
import FrontendRoutes from "./routes/frontendRoutes";
import LoginRoutes from "./routes/loginRoutes";
import SequenceRoutes from "./routes/sequenceRoutes";
import VirusRoutes from "./routes/virusRoutes";
import { Server } from "restify";

export default function (server: Server) {
	FrontendRoutes.applyRoutes(server);
	LoginRoutes.applyRoutes(server);
	UserRoutes.applyRoutes(server);
	EpitopeRoutes.applyRoutes(server);
	SequenceRoutes.applyRoutes(server);
	VirusRoutes.applyRoutes(server);
}
