import knex from "knex";
import config from "../../knexfile";

const schema = "vsdbmv2";

const { database, ...connection } = config.production.connection;

async function main() {
	try {
		const db = knex({
			client: config.production.client,
			connection,
		});
		await db.raw("CREATE DATABASE IF NOT EXISTS ??;", schema);
		const migrationsExist = await db.schema.withSchema(schema).hasTable("knex_migrations");
		if (!migrationsExist) {
			await db.schema.withSchema(schema).createTable("knex_migrations", (table) => {
				table.increments("id").primary();
				table.string("name", 255);
				table.integer("batch");
				table.dateTime("migration_time").defaultTo(db.fn.now());
			});
		}
		db.destroy();
		console.log("Schema created successfully");
	} catch (error) {
		console.error("Error creating schema:", error);
	}
}

main();
