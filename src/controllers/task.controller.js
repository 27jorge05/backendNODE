import { randomUUID } from 'node:crypto';
import pool from '../db/connection.js';
import {
  insertTask,
  updateTask,
  updateTaskStatus,
  replaceTaskTags,
  deleteTask,
  findTasksByUserId,
  findTaskById,
  findTagsByTaskIds,
} from '../db/task.queries.js';
import { categoryBelongsToUser } from '../db/category.queries.js';
import { countTagsOwnedByUser } from '../db/tag.queries.js';
import { decorateTask } from '../decorators/task.decorator.js';

async function buildTaskResponse(id, userId) {
    const task = await findTaskById({ id, userId });

    if (!task) {
        return null;
    }

    const tags = await findTagsByTaskIds({ taskIds: [id], userId });

    return decorateTask(task, tags);
}

export async function store(req, res, next) {
    const userId = req.auth.userId;
    const { title, description, status, categoryId, tagIds } = req.body;

    if (categoryId) {
        const ownsCategory = await categoryBelongsToUser({ id: categoryId, userId });

        if (!ownsCategory) {
            return res.status(400).json({
                error: {
                    message: 'La categoría no existe o no te pertenece.',
                },
            });
        }
    }

    if (tagIds.length > 0) {
        const ownedCount = await countTagsOwnedByUser({ ids: tagIds, userId });

        if (ownedCount !== tagIds.length) {
            return res.status(400).json({
                error: {
                    message: 'Una de las etiquetas no existe o no te pertenece.',
                },
            });
        }
    }

    const id = randomUUID();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await insertTask({
            id,
            title,
            description,
            status,
            categoryId,
            userId,
            connection,
        });
        await replaceTaskTags({ taskId: id, tagIds, connection });

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        return next(error);
    } finally {
        connection.release();
    }

    const task = await buildTaskResponse(id, userId);

    return res.status(201).json({
        data: { task },
    });
}

export async function index(req, res) {
    const userId = req.auth.userId;
    const tasks = await findTasksByUserId(userId);

    if (tasks.length === 0) {
        return res.status(200).json({ data: { tasks: [] } });
    }

    const taskIds = tasks.map((task) => task.id);
    const tagRows = await findTagsByTaskIds({ taskIds, userId });

    const tagsByTask = new Map();
    for (const row of tagRows) {
        if (!tagsByTask.has(row.taskId)) {
            tagsByTask.set(row.taskId, []);
        }
        tagsByTask.get(row.taskId).push(row);
    }

    const result = tasks.map((task) => (
        decorateTask(task, tagsByTask.get(task.id) ?? [])
    ));

    return res.status(200).json({
        data: { tasks: result },
    });
}

export async function show(req, res) {
    const task = await buildTaskResponse(req.params.id, req.auth.userId);

    if (!task) {
        return res.status(404).json({
            error: {
                message: 'Tarea no encontrada.',
            },
        });
    }

    return res.status(200).json({ data: { task } });
}

export async function update(req, res, next) {
    const id = req.params.id;
    const userId = req.auth.userId;
    const body = req.body;

    const existing = await findTaskById({ id, userId });

    if (!existing) {
        return res.status(404).json({
            error: {
                message: 'Tarea no encontrada.',
            },
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if ('categoryId' in body || 'title' in body || 'description' in body || 'status' in body) {
            const categoryId = 'categoryId' in body ? body.categoryId : existing.categoryId;
            const title = body.title ?? existing.title;
            const description = 'description' in body ? (body.description ?? null) : existing.description;
            const status = body.status ?? existing.status;

            if (categoryId) {
                const ownsCategory = await categoryBelongsToUser({ id: categoryId, userId });

                if (!ownsCategory) {
                    await connection.rollback();
                    return res.status(400).json({
                        error: {
                            message: 'La categoría no existe o no te pertenece.',
                        },
                    });
                }
            }

            await updateTask({ id, title, description, status, categoryId, userId, connection });
        }

        if ('tagIds' in body) {
            const tagIds = body.tagIds ?? [];

            if (tagIds.length > 0) {
                const ownedCount = await countTagsOwnedByUser({ ids: tagIds, userId });

                if (ownedCount !== tagIds.length) {
                    await connection.rollback();
                    return res.status(400).json({
                        error: {
                            message: 'Una de las etiquetas no existe o no te pertenece.',
                        },
                    });
                }
            }

            await replaceTaskTags({ taskId: id, tagIds, connection });
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        return next(error);
    } finally {
        connection.release();
    }

    const task = await buildTaskResponse(id, userId);

    return res.status(200).json({ data: { task } });
}

export async function updateStatus(req, res, next) {
    const { status } = req.body;
    const affectedRows = await updateTaskStatus({
        id: req.params.id,
        status,
        userId: req.auth.userId,
    });

    if (affectedRows === 0) {
        return res.status(404).json({
            error: {
                message: 'Tarea no encontrada.',
            },
        });
    }

    const task = await buildTaskResponse(req.params.id, req.auth.userId);

    return res.status(200).json({ data: { task } });
}

export async function destroy(req, res, next) {
    try {
        const affectedRows = await deleteTask({
            id: req.params.id,
            userId: req.auth.userId,
        });

        if (affectedRows === 0) {
            return res.status(404).json({
                error: {
                    message: 'Tarea no encontrada.',
                },
            });
        }

        return res.status(204).end();
    } catch (error) {
        return next(error);
    }
}