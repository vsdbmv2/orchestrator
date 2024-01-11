import { Request, Response } from "express";

import sha1 from "sha1";
import knex from "../services/database";
import { IUser } from "../@types";

export default {
	async createUser(req: Request, res: Response) {
		const { name, email, password } = req.body;

		const user_model = {
			name,
			email,
			password: sha1(password),
		};

		const id = await knex("user").insert(user_model);

		res.send({ status: "success", data: { message: "User created successfully", id } });
	},

	async deleteUser(req: Request, res: Response) {
		const { id } = req.params;

		await knex("user").where("id", id).del();

		res.send({ status: "success", data: { message: "User successfully removed" } });
	},

	async getUser(_: Request, res: Response) {
		let users = await knex("user").select();

		if (!users) {
			users = [];
		} else {
			for (const user of users) {
				user.password = "hidden";
			}
		}

		res.send({ status: "success", data: users });
	},

	async updateUser(req: Request, res: Response) {
		const id = req.user?.id;

		const { name, email, password } = req.body;

		const user_model = {
			name: name ? name : undefined,
			email: email ? email : undefined,
			password: password ? sha1(password) : undefined,
		};

		await knex("user").where("id", id).update(user_model);

		res.send({ status: "success", data: { message: "User updated successfully" } });
	},
};
