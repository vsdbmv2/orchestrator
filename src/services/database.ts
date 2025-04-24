import dotenv from "dotenv";
import Knex from "knex";

dotenv.config();

const knex = Knex({
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST as string,
		user: process.env.DB_USER as string,
		password: process.env.DB_PASSWORD as string,
		database: process.env.DB_NAME as string,
		port: Number(process.env.DB_PORT as string) as number,
		multipleStatements: true,
	},
	pool: {
		min: Number(process.env.DB_POOL_MIN as string) as number,
		max: Number(process.env.DB_POOL_MAX as string) as number,
	},
});

export default knex;
