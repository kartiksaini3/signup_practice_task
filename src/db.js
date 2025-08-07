import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const createTables = async () => {
  try {
    await pool.connect();

    // Create users table
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL PRIMARY KEY,
          password TEXT NOT NULL,
          role TEXT,
          organisation_name TEXT,
          contract_number TEXT,
          contact_person TEXT
        );
      `);

    // Create reports table
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS reports (
          report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          auditor_id TEXT REFERENCES users(email) ON DELETE SET NULL,
          report_name TEXT NOT NULL,
          report_status TEXT,
          is_approved BOOLEAN DEFAULT FALSE
        );
      `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await pool.end();
  }
};
