import pool from './connection.js';

export async function insertTag({ id, name, userId }) {
  await pool.execute(
    'INSERT INTO tags (id, name, user_id) VALUES (?, ?, ?)',
    [id, name, userId],
  );
}

export async function findTagsByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT id, name
     FROM tags
     WHERE user_id = ?
     ORDER BY name, id`,
    [userId],
  );

  return rows;
}

export async function findTagById({ id, userId }) {
  const [rows] = await pool.execute(
    `SELECT id, name
     FROM tags
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return rows[0] ?? null;
}

export async function updateTag({ id, name, userId }) {
  const [result] = await pool.execute(
    `UPDATE tags
     SET name = ?
     WHERE id = ? AND user_id = ?`,
    [name, id, userId],
  );

  return result.affectedRows;
}

export async function deleteTag({ id, userId }) {
  const [result] = await pool.execute(
    `DELETE FROM tags
     WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return result.affectedRows;
}