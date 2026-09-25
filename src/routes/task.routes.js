import { Router } from 'express';
import {
  store,
  index,
  show,
  update,
  updateStatus,
  destroy,
} from '../controllers/task.controller.js';
import {
  taskCreateSchema,
  taskUpdateSchema,
  taskStatusSchema,
  taskIdSchema,
} from '../validators/task.schema.js';

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
  const { error } = taskIdSchema.validate(id);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  return next();
});

function validateSchema(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: {
          message: error.details[0].message,
        },
      });
    }

    req.body = value;
    return next();
  };
}

router.post('/', validateSchema(taskCreateSchema), store);
router.get('/', index);
router.get('/:id', show);
router.patch('/:id', validateSchema(taskUpdateSchema), update);
router.patch('/:id/status', validateSchema(taskStatusSchema), updateStatus);
router.delete('/:id', destroy);

export default router;