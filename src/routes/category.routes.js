import { Router } from 'express';
import {
  store,
  index,
  show,
  update,
  destroy,
} from '../controllers/category.controller.js';
import {
  categoryBodySchema,
  categoryIdSchema,
} from '../validators/category.schema.js';

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
  const { error } = categoryIdSchema.validate(id);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  return next();
});

function validateCategoryBody(req, res, next) {
  const { error, value } = categoryBodySchema.validate(req.body);

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

router.post('/', validateCategoryBody, store);
router.get('/', index);
router.get('/:id', show);
router.patch('/:id', validateCategoryBody, update);
router.delete('/:id', destroy);

export default router;