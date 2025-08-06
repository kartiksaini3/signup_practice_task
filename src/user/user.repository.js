import { Client } from "pg";
import dotenv from "dotenv";
import { commonReturn } from "../utils/functions.js";

dotenv.config();

const client = new Client({
  connectionString: process.env.DB_URL,
});

export const createUser = async ({ email, hashedPassword }, res) => {
  const query = `
    INSERT INTO users (name, password)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    await client.query(query, [email, hashedPassword]);
  } catch (err) {
    console.error("DB Error:", err);

    // 23505 = unique_violation in PostgreSQL
    if (err.code === "23505") {
      commonReturn(res, "User Already Exists", null, 400);
    } else commonReturn(res, null, null, 500);
  }
};

export const getUserByUsername = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE name = $1
    LIMIT 1;
  `;

  const result = await client.query(query, [email]);
  return result.rows[0]; // returns undefined if not found
};
