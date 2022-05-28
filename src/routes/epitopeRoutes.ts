import { Router } from "restify-router";

import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";
import epitopeController from "../controllers/epitopeController";

const router = new Router();

router.get("/epitope/count/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			epitopeController.getCount(req, res).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/epitope/iedb/count/", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			epitopeController.getIedbCount(req, res).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/epitope/iedb/assay/count/", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			epitopeController.getIedbAssayCount(req, res).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/epitope/assay/top/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			epitopeController.getTopEpitopesWithAssay(req, res).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

export default router;
