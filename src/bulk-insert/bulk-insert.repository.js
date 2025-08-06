export const bulkInsertDataToTable = async (data, tableName) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
`;
  await pool.query(createTableQuery);
  const placeholders = data.map((_, i) => `($${i + 1})`).join(", ");
  const query = `INSERT INTO ${tableName} (name) VALUES ${placeholders} RETURNING *`;
  await pool.query(query, values);
};
