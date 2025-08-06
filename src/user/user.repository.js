import { commonReturn } from "../utils/functions.js";

export const createUser = async ({ email, hashedPassword }, res) => {
  const query = `
    INSERT INTO users (name, password)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    await pool.query(query, [email, hashedPassword]);
  } catch (err) {
    console.error("DB Error:", err);

    if (err.code === "23505") {
      // 23505 = unique_violation in PostgreSQL
      // throw new ConflictException("User Already Exists");
      commonReturn(res, "User Already Exists", null, 400);
    } else {
      throw new InternalServerErrorException();
    }
  }
};

export const getUserByUsername = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE name = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0]; // returns undefined if not found
};
