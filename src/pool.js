import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const poolClient = new Pool({
  connectionString: process.env.DB_URL,
});
