import { Router } from "restify-router";
import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";

const router = new Router();

router.post("/login/", function (req, res) {
	try {
		loginController.login(req, res).catch((error) => {
			returnInternalServerError(error, res);
		});
	} catch (error) {
		returnInternalServerError(error as Error, res);
	}
});

export default router;
