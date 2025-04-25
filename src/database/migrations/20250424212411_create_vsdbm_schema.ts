import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.withSchema("vsdbmv2").createTable("user", (table) => {
		table.increments("id").primary();
		table.string("name");
		table.string("email", 250).notNullable();
		table.string("password", 250).notNullable();
		table.string("context", 45);
		table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
	});
	await knex.schema.withSchema("vsdbmv2").createTable("virus", (table) => {
		table.increments("id").primary();
		table.string("name", 500).notNullable();
		table.string("reference_accession", 100).notNullable();
		table.integer("taxonomy_id");
		table.string("taxonomy", 250);
		table.string("database_name", 100).notNullable();
		table.dateTime("lastest_update").notNullable().defaultTo(knex.fn.now());
		table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.withSchema("vsdbmv2").dropTableIfExists("virus");
	await knex.schema.dropSchemaIfExists("vsdbmv2");
}
