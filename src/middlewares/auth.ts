import loginController from "../controllers/loginController";
import { Request, Response, NextFunction } from "express";

export type userContext = "op" | "user";

export const getUser = (context: userContext) => async (req: Request, res: Response, next: NextFunction) => {
	const user = await loginController.verifyToken(req, context);
	if (!user) {
		res.status(401);
		return res.send("user not found");
	}
	req.user = user;
	next();
};

export default {
	getUser,
};
