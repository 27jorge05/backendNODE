import pool from './connection.js';

export async function insertUser({ id, name, email, passwordHash }) {
  await pool.execute(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, passwordHash],
  );
}