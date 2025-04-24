import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
	// Inserts seed entries
	await knex
		.withSchema("vsdbmv2")
		.table("user")
		.insert([
			{
				email: "heltonfabio@outlook.com",
				name: "Helton Fábio",
				password: "ecc2278c612ce6d8090371320407479e94537e2a",
				context: "op",
			},
			{
				email: "irahe22@gmail.com",
				name: "José Irahe",
				password: "ecc2278c612ce6d8090371320407479e94537e2a",
				context: "op",
			},
		]);
}
