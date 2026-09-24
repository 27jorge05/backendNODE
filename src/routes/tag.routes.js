import { Router } from 'express';
import {
  createTag,
  listTags,
  getTag,
  editTag,
  removeTag,
} from '../controllers/tag.controller.js';
import {
  tagBodySchema,
  tagIdSchema,
} from '../validators/tag.schema.js';

const router = Router();

router.use((req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({
      error: {
        message: 'Se requiere autenticación.',
      },
    });
  }

  return next();
});

router.param('id', (req, res, next, id) => {
  const { error } = tagIdSchema.validate(id);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  return next();
});

function validateTagBody(req, res, next) {
  const { error, value } = tagBodySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  req.body = value;
  return next();
}

router.post('/', validateTagBody, createTag);
router.get('/', listTags);
router.get('/:id', getTag);
router.patch('/:id', validateTagBody, editTag);
router.delete('/:id', removeTag);

export default router;