import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DB_URL,
});

export const createTables = async () => {
  try {
    await client.connect();

    // Create users table
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL PRIMARY KEY,
          role TEXT,
          organisation_name TEXT,
          contract_number TEXT,
          contact_person TEXT
        );
      `);

    // Create reports table
    await client.query(`
        CREATE TABLE IF NOT EXISTS reports (
          report_id SERIAL PRIMARY KEY,
          auditor_id INTEGER REFERENCES users(email) ON DELETE SET NULL,
          report_name TEXT NOT NULL,
          report_status TEXT,
          is_approved BOOLEAN DEFAULT FALSE
        );
      `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await client.end();
  }
};
