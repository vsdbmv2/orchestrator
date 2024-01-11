import auth from "./../middlewares/auth";
import { Router } from "express";
import loginController from "../controllers/loginController";
import { returnInternalServerError } from "../controllers/errorController";
import virusController from "../controllers/virusController";

const router = Router();

router
	.route("/virus/")
	.get(auth.getUser("user"), virusController.getAll)
	.post(auth.getUser("op"), virusController.create);

router
	.route("/virus/:id")
	.get(auth.getUser("user"), virusController.getById)
	.put(auth.getUser("op"), virusController.update)
	.delete(auth.getUser("op"), virusController.deleteVirus);

export default router;
