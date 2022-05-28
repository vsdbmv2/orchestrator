import { Router } from "restify-router";

import userController from "../controllers/userController";
import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";

const router = new Router();

router.post("/user/", async function (req, res) {
	//executa aqui quando a rota for chamada.
	userController.createUser(req, res).catch((error) => {
		returnInternalServerError(error as Error, res);
	});
});

router.del("/user/:id", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "op");
		if (!user) {
			throw new Error("Token Inválido");
		} else {
			userController.deleteUser(req, res, user).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.get("/user/", async function (req, res) {
	//para request autenticado, basta descomentar abaixo...
	try {
		const user = await loginController.verifyToken(req, "op");
		if (!user) {
			throw new Error("Token Inválido");
		} else {
			userController.getUser(req, res).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

router.put("/user/", async function (req, res) {
	try {
		const user = await loginController.verifyToken(req, "user");
		if (!user) {
			throw new Error("Token Inválido");
		} else {
			userController.updateUser(req, res, user).catch((error) => {
				returnInternalServerError(error as Error, res);
			});
		}
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

export default router;
