import { Router } from "restify-router";
import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";
import sequenceController from "../controllers/sequenceController";

const router = new Router();

router.get("/sequence/count/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			sequenceController.getCount(req, res).catch((error: Error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});
router.get("/sequence/coverage/avg/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			sequenceController.getCoverageAvg(req, res).catch((error: Error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/sequence/translation/count/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			sequenceController.getTranslationCount(req, res).catch((error: Error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});
router.get("/sequence/count/day/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			sequenceController.getCountPerDay(req, res).catch((error: Error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});
router.get("/sequence/count/country/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			sequenceController.getCountPerCountry(req, res).catch((error: Error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

export default router;
