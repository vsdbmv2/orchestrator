import { Router } from "restify-router";
import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";
import virusController from "../controllers/virusController";

const router = new Router();

router.get("/virus/", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			virusController.getAll(req, res, user).catch((error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/virus/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			//route protected
			virusController.getById(req, res, user).catch((error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.post("/virus/", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "op");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			//route protected
			virusController.create(req, res).catch((error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.put("/virus/:id", async function (req, res) {
	try {
		// let user = await loginController.verifyToken(req, 'updateVirus.service');
		const user = await loginController.verifyToken(req, "op");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			//route protected
			virusController.update(req, res, user).catch((error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.del("/virus/:id", async function (req, res) {
	try {
		// let user = await loginController.verifyToken(req, jwt, 'deleteVirus.service', knex);
		const user = await loginController.verifyToken(req, "op");
		if (!user) {
			throw new Error("Invalid Token");
		} else {
			//route protected
			virusController.delete(req, res, user).catch((error) => {
				returnInternalServerError(error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

export default router;
