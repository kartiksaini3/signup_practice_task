import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const bulkInsertDataToTable = async (data, tableName) => {
  const client = new Client({
    connectionString: process.env.DB_URL,
  });

  try {
    await client.connect();

    const createTableQuery = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL
      );
    `;
    await client.query(createTableQuery);

    if (!data.length) {
      return { message: "No data to insert.", inserted: [] };
    }

    const placeholders = data.map((_, i) => `($${i + 1})`).join(", ");
    const insertQuery = `
      INSERT INTO ${tableName} (name)
      VALUES ${placeholders}
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `;

    const result = await client.query(insertQuery, data);
    return { message: "Inserted successfully", inserted: result.rows };
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
};
