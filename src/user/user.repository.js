import { poolClient } from "../pool.js";

export const createUser = async (email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, password)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    await poolClient.query(query, [email, hashedPassword]);
  } catch (err) {
    throw err;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const query = `
      SELECT * FROM users
      WHERE email = $1
      LIMIT 1;
    `;
    const result = await poolClient.query(query, [email]);

    return result.rows[0]; // returns undefined if not found
  } catch (err) {
    throw err;
  }
};
