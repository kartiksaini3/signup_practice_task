import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DB_URL,
});

export const bulkInsertDataToTable = async (data, tableName) => {
  const createTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
     CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL
  );
`;
  await client.query(createTableQuery);
  const placeholders = data.map((_, i) => `($${i + 1})`).join(", ");
  const query = `INSERT INTO ${tableName} (name) VALUES ${placeholders} RETURNING *`;
  await client.query(query, data);
};
