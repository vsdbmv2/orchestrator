import auth from "./../middlewares/auth";
import { Router } from "express";
import virusController from "../controllers/virusController";

const router = Router();

router
	.route("/virus/:id")
	.get(auth.getUser("user"), virusController.getById)
	.put(auth.getUser("op"), virusController.update)
	.delete(auth.getUser("op"), virusController.deleteVirus);

router.route("/virus-cleanup/").get(auth.getUser("user"), virusController.cleanUpDuplicateGis);

router
	.route("/virus/")
	.get(auth.getUser("user"), virusController.getAll)
	.post(auth.getUser("op"), virusController.create);

export default router;
