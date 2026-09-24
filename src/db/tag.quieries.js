import pool from './connection.js';

export async function categoryBelongsToUser({ id, userId }) {
    const [rows] = await pool.execute(
        'SELECT id FROM categories WHERE id = ? AND user_id = ?',
        [id, userId],
    );

    return rows.length > 0;
}

export async function countTagsOwnedByUser({ ids, userId }) {
    const placeholders = ids.map(() => '?').join(', ');

    const [rows] = await pool.execute(
        `SELECT id
     FROM tags
     WHERE user_id = ? AND id IN (${placeholders})`,
        [userId, ...ids],
    );

    return rows.length;


}
export async function insertTask({ id, title, description, status, categoryId, userId, connection = pool }) {
    await connection.execute(
        `INSERT INTO tasks (id, title, description, status, category_id, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [id, title, description, status, categoryId, userId],
    );
}

export async function updateTask({ id, title, description, status, categoryId, userId, connection = pool }) {
    const [result] = await connection.execute(
        `UPDATE tasks
     SET title = ?, description = ?, status = ?, category_id = ?
     WHERE id = ? AND user_id = ?`,
        [title, description, status, categoryId, id, userId],
    );

    return result.affectedRows;
}

export async function updateTaskStatus({ id, status, userId, connection = pool }) {
    const [result] = await connection.execute(
        `UPDATE tasks
     SET status = ?
     WHERE id = ? AND user_id = ?`,
        [status, id, userId],
    );

    return result.affectedRows;
}

export async function replaceTaskTags({ taskId, tagIds, connection }) {
    await connection.execute(
        'DELETE FROM task_tags WHERE task_id = ?',
        [taskId],
    );

    if (tagIds.length === 0) {
        return;
    }

    const placeholders = tagIds.map(() => '(?, ?)').join(', ');
    const params = tagIds.flatMap((tagId) => [taskId, tagId]);

    await connection.execute(
        `INSERT INTO task_tags (task_id, tag_id) VALUES ${placeholders}`,
        params,
    );
}

export async function deleteTask({ id, userId, connection = pool }) {
    const [result] = await connection.execute(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, userId],
    );

    return result.affectedRows;
}
export async function findTasksByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status,
            t.category_id AS categoryId, c.name AS categoryName,
            t.created_at AS createdAt
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.user_id = ?
     ORDER BY t.created_at, t.id`,
    [userId],
  );

  return rows;
}

export async function findTaskById({ id, userId }) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status,
            t.category_id AS categoryId, c.name AS categoryName,
            t.created_at AS createdAt
     FROM tasks t
     LEFT JOIN categories c ON c.id = t.category_id
     WHERE t.id = ? AND t.user_id = ?`,
    [id, userId],
  );

  return rows[0] ?? null;
}

export async function findTagsByTaskIds({ taskIds, userId }) {
  const placeholders = taskIds.map(() => '?').join(', ');

  const [rows] = await pool.execute(
    `SELECT tt.task_id AS taskId, t.id, t.name
     FROM task_tags tt
     JOIN tags t ON t.id = tt.tag_id
     JOIN tasks ta ON ta.id = tt.task_id
     WHERE ta.user_id = ? AND tt.task_id IN (${placeholders})
     ORDER BY t.name`,
    [userId, ...taskIds],
  );

  return rows;
}