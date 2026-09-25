import { randomUUID } from 'node:crypto';
import {
  insertTag,
  findTagsByUserId,
  findTagById,
  updateTag,
  deleteTag,
} from '../db/tag.queries.js';
import { decorateTag } from '../decorators/tag.decorator.js';

export async function store(req, res, next) {
  const userId = req.auth.userId;
  const { name } = req.body;
  const id = randomUUID();

  try {
    await insertTag({ id, name, userId });

    return res.status(201).json({
      data: {
        tag: decorateTag({ id, name }),
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          message: 'Ya existe una etiqueta con esos datos.',
        },
      });
    }

    return next(error);
  }
}

export async function index(req, res) {
  const tags = await findTagsByUserId(req.auth.userId);

  return res.status(200).json({
    data: {
      tags: tags.map(decorateTag),
    },
  });
}

export async function show(req, res) {
  const tag = await findTagById({
    id: req.params.id,
    userId: req.auth.userId,
  });

  if (!tag) {
    return res.status(404).json({
      error: {
        message: 'Etiqueta no encontrada.',
      },
    });
  }

  return res.status(200).json({
    data: {
      tag: decorateTag(tag),
    },
  });
}

export async function update(req, res, next) {
  const id = req.params.id;
  const userId = req.auth.userId;
  const { name } = req.body;

  const existingTag = await findTagById({ id, userId });

  if (!existingTag) {
    return res.status(404).json({
      error: {
        message: 'Etiqueta no encontrada.',
      },
    });
  }

  try {
    await updateTag({ id, name, userId });

    const tag = await findTagById({ id, userId });

    if (!tag) {
      return res.status(404).json({
        error: {
          message: 'Etiqueta no encontrada.',
        },
      });
    }

    return res.status(200).json({
      data: {
        tag: decorateTag(tag),
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          message: 'Ya tienes una etiqueta con ese nombre.',
        },
      });
    }

    return next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const affectedRows = await deleteTag({
      id: req.params.id,
      userId: req.auth.userId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        error: {
          message: 'Etiqueta no encontrada.',
        },
      });
    }

    return res.status(204).end();
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: {
          message: 'No se puede eliminar una etiqueta que tiene relaciones.',
        },
      });
    }

    return next(error);
  }
}
