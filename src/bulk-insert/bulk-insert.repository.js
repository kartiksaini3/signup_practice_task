import { poolClient } from "../pool.js";

export const bulkInsertDataToTable = async (data, tableName) => {
  try {
    const createTableQuery = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL
      );
    `;
    await poolClient.query(createTableQuery);

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

    await poolClient.query(insertQuery, data);
  } catch (err) {
    throw err;
  }
};
