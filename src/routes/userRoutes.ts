import { Router } from "express";

import userController from "../controllers/userController";
import auth from "../middlewares/auth";

const router = Router();

router
	.route("/user/")
	.post(userController.createUser)
	.get(auth.getUser("op"), userController.getUser)
	.put(auth.getUser("user"), userController.updateUser);

router.delete("/user/:id", auth.getUser("op"), userController.deleteUser);

export default router;
