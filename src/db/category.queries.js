import pool from './connection.js';

export async function insertCategory({ id, name, userId }) {
  await pool.execute(
    'INSERT INTO categories (id, name, user_id) VALUES (?, ?, ?)',
    [id, name, userId],
  );
}

export async function findCategoriesByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT id, name
     FROM categories
     WHERE user_id = ?
     ORDER BY name, id`,
    [userId],
  );

  return rows;
}

export async function findCategoryById({ id, userId }) {
  const [rows] = await pool.execute(
    `SELECT id, name
     FROM categories
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return rows[0] ?? null;
}

export async function updateCategory({ id, name, userId }) {
  const [result] = await pool.execute(
    `UPDATE categories
     SET name = ?
     WHERE id = ? AND user_id = ?`,
    [name, id, userId],
  );

  return result.affectedRows;
}

export async function deleteCategory({ id, userId }) {
  const [result] = await pool.execute(
    `DELETE FROM categories
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return result.affectedRows;
}