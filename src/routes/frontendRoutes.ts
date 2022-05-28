import { Router } from "restify-router";
import frontendController from "../controllers/frontendController";
import { returnInternalServerError } from "../controllers/errorController";

const router = new Router();

router.post("/epitope_assay/", async function (req, res) {
	//executa aqui quando a rota for chamada.
	frontendController.getEpitopeInfos(req, res).catch((error: Error) => {
		returnInternalServerError(error, res);
	});
});

router.post("/epitope_by_linearsequence/", async function (req, res) {
	//executa aqui quando a rota for chamada.
	frontendController.getEpitopeInfosByLinearSequence(req, res).catch((error: Error) => {
		returnInternalServerError(error, res);
	});
});
router.post("/epitopes/", async function (req, res) {
	//executa aqui quando a rota for chamada.
	frontendController.getEpitopeList(req, res).catch((error: Error) => {
		returnInternalServerError(error, res);
	});
});
router.post("/lucifrequence/", async function (req, res) {
	//executa aqui quando a rota for chamada.
	frontendController.luciFrequence(req, res).catch((error: Error) => {
		returnInternalServerError(error, res);
	});
});

export default router;
