import { poolClient } from "../pool.js";

export const createUser = async (email) => {
  const query = `
    INSERT INTO users (name)
    VALUES ($1)
    RETURNING *;
  `;

  try {
    await poolClient.query(query, [email]);
  } catch (err) {
    throw err;
  }
};

export const updateUserPassword = async (email, newPassword) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE email = $2 AND password IS NULL
    RETURNING *;
  `;

  try {
    const result = await poolClient.query(query, [newPassword, email]);
    console.log("result", result);

    if (result.rowCount === 0) {
      const error = new Error("User already registered or not verified yet");
      error.code = 999;
      throw error;
    }

    return result.rows[0];
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

    return result?.rows?.[0]; // returns undefined if not found
  } catch (err) {
    throw err;
  }
};
