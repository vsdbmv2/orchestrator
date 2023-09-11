import Knex from "knex";

const knex = Knex({
	client: "mysql2",
	connection: {
		host: process.env.DB_HOST_CONTEXT_VSDBM as string,
		user: process.env.DB_USER_CONTEXT_VSDBM as string,
		password: process.env.DB_PASSWORD_CONTEXT_VSDBM as string,
		database: process.env.DB_DATABASE_CONTEXT_VSDBM as string,
		multipleStatements: true,
	},
	pool: {
		min: Number(process.env.DB_POOL_MIN as string) as number,
		max: Number(process.env.DB_POOL_MAX as string) as number,
	},
});

export default knex;
