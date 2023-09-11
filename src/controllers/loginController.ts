import { Request, Response } from "restify";
import knex from "../services/database";
import jwt from "jsonwebtoken";
import sha1 from "sha1";

// import email from "../utils/mailgunEmailController";

export default {
	async login(req: Request, res: Response) {
		const data = await knex("user")
			.where("email", req.body.email)
			.andWhere("password", sha1(req.body.password))
			.first();
		if (!data) {
			throw new Error("unauthorized");
		} else {
			jwt.sign({ data }, process.env.SV_SECRET as string, (err: Error | null, token: string | undefined) => {
				if (!err) {
					data.password = "hidden";
					res.json({ status: "success", data: { token, user: data } });
				} else {
					throw new Error("Token could not be created.");
				}
			});
		}
	},

	async verifyToken(req: Request, context: "user" | "op") {
		const bearerHeader = req?.headers["authorization"];
		if (typeof bearerHeader !== "undefined") {
			const tkn = bearerHeader.split(" ")[1] as string;
			const secret = process.env.SV_SECRET as string;
			const user = await jwt.verify(tkn, secret, async (err, tokenData) => {
				if (err) {
					return err;
				} else {
					if (
						(tokenData as jwt.JwtPayload)?.data?.context === context ||
						(tokenData as jwt.JwtPayload)?.data?.context === "op"
					) {
						return (tokenData as jwt.JwtPayload).data;
					} else {
						return false;
					}
				}
			});
			return user;
		} else {
			return false;
		}
	},

	twoDigits(d: number) {
		if (0 <= d && d < 10) return "0" + d.toString();
		if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
		return d.toString();
	},

	convertDateToMysql(date: Date) {
		return (
			date.getUTCFullYear() +
			"-" +
			this.twoDigits(1 + date.getMonth()) +
			"-" +
			this.twoDigits(date.getDate()) +
			" " +
			this.twoDigits(date.getHours()) +
			":" +
			this.twoDigits(date.getMinutes()) +
			":" +
			this.twoDigits(date.getSeconds())
		);
	},
};
