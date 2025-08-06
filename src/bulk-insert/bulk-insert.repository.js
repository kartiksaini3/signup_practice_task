import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DB_URL,
});

export const bulkInsertDataToTable = async (data, tableName) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
`;
  await client.query(createTableQuery);
  const placeholders = data.map((_, i) => `($${i + 1})`).join(", ");
  const query = `INSERT INTO ${tableName} (name) VALUES ${placeholders} RETURNING *`;
  await client.query(query, values);
};
