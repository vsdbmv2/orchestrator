// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_POOL_MIN, DB_POOL_MAX } = process.env;

const config = {
	client: "mysql2",
	connection: {
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
		port: +(process.env.DB_PORT || 3306),
		multipleStatements: true,
	},
	pool: {
		min: +(DB_POOL_MIN || 2),
		max: +(DB_POOL_MAX || 10),
	},
	migrations: {
		tableName: "knex_migrations",
		directory: "./src/database/migrations",
	},
	seeds: {
		directory: "./src/database/seeds",
	},
};

export default {
	development: {
		...config,
		debug: true,
		asyncStackTraces: true,
	},
	staging: config,
	production: config,
};
