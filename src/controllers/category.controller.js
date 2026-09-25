import { randomUUID } from 'node:crypto';
import {
  insertCategory,
  findCategoriesByUserId,
  findCategoryById,
  updateCategory,
  deleteCategory,
} from '../db/category.queries.js';
import { decorateCategory } from '../decorators/category.decorator.js';

export async function store(req, res, next) {
  const userId = req.auth.userId;
  const { name } = req.body;
  const id = randomUUID();

  try {
    await insertCategory({ id, name, userId });

    return res.status(201).json({
      data: {
        category: decorateCategory({ id, name }),
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          message: 'Ya existe una categoría con esos datos.',
        },
      });
    }

    return next(error);
  }
}

export async function index(req, res) {
  const categories = await findCategoriesByUserId(req.auth.userId);

  return res.status(200).json({
    data: {
      categories: categories.map(decorateCategory),
    },
  });
}

export async function show(req, res) {
  const category = await findCategoryById({
    id: req.params.id,
    userId: req.auth.userId,
  });

  if (!category) {
    return res.status(404).json({
      error: {
        message: 'Categoría no encontrada.',
      },
    });
  }

  return res.status(200).json({
    data: {
      category: decorateCategory(category),
    },
  });
}

export async function update(req, res, next) {
  const id = req.params.id;
  const userId = req.auth.userId;
  const { name } = req.body;

  const existingCategory = await findCategoryById({ id, userId });

  if (!existingCategory) {
    return res.status(404).json({
      error: {
        message: 'Categoría no encontrada.',
      },
    });
  }

  try {
    await updateCategory({ id, name, userId });

    const category = await findCategoryById({ id, userId });

    if (!category) {
      return res.status(404).json({
        error: {
          message: 'Categoría no encontrada.',
        },
      });
    }

    return res.status(200).json({
      data: {
        category: decorateCategory(category),
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          message: 'Ya tienes una categoría con ese nombre.',
        },
      });
    }

    return next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const affectedRows = await deleteCategory({
      id: req.params.id,
      userId: req.auth.userId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        error: {
          message: 'Categoría no encontrada.',
        },
      });
    }

    return res.status(204).end();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: {
          message: 'No se puede eliminar una categoría que tiene relaciones.',
        },
      });
    }

    return next(error);
  }
}