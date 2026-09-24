import pool from './connection.js';

export async function insertUser({ id, name, email, passwordHash }) {
  await pool.execute(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, passwordHash],
  );
}
export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password
     FROM users
     WHERE email = ?`,
    [email],
  );

  return rows[0] ?? null;
}