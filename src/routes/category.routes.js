import { Router } from 'express';
import {
  createCategory,
  listCategories,
  getCategory,
  editCategory,
  removeCategory,
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

router.post('/', validateCategoryBody, createCategory);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.patch('/:id', validateCategoryBody, editCategory);
router.delete('/:id', removeCategory);

export default router;