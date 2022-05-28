import fs from "fs";
import path from "path";
import knex from "../services/database";

const create_sql = (db_name: string) => {
	const sqlPath = path.resolve(__dirname, "viral_model.sql");
	const sql = fs.readFileSync(sqlPath, "utf-8");
	return sql.replace(/viral_model/gi, db_name);
};

const viralModel = async (db_name: string) => {
	const newDatabase = create_sql(db_name);
	return await knex.raw(newDatabase);
};
export default viralModel;
