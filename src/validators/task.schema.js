import Joi from 'joi';

const titleRules = Joi.string()
  .trim()
  .max(200)
  .required()
  .messages({
    'string.base': 'El título debe ser texto.',
    'string.empty': 'El título no puede estar vacío.',
    'string.max': 'El título no puede superar los 200 caracteres.',
    'any.required': 'El título es obligatorio.',
  });

const descriptionRules = Joi.string()
  .trim()
  .max(1000)
  .allow('', null)
  .messages({
    'string.base': 'La descripción debe ser texto.',
    'string.max': 'La descripción no puede superar los 1000 caracteres.',
  });

const statusRules = Joi.string()
  .valid('pending', 'completed')
  .messages({
    'string.base': 'El estado debe ser texto.',
    'any.only': 'El estado debe ser "pending" o "completed".',
  });

const categoryIdRules = Joi.string()
  .guid({ version: 'uuidv4' })
  .allow(null)
  .messages({
    'string.guid': 'La categoría debe ser un UUID válido.',
  });

const tagIdsRules = Joi.array()
  .items(Joi.string().guid({ version: 'uuidv4' }))
  .max(20)
  .unique()
  .messages({
    'array.base': 'Las etiquetas deben ser una lista.',
    'array.max': 'Una tarea no puede tener más de 20 etiquetas.',
    'array.unique': 'La petición contiene etiquetas duplicadas.',
    'string.guid': 'Cada etiqueta debe ser un UUID válido.',
  });

export const taskCreateSchema = Joi.object({
  title: titleRules,
  description: descriptionRules.default(null),
  status: statusRules.default('pending'),
  categoryId: categoryIdRules,
  tagIds: tagIdsRules.default([]),
})
  .required()
  .unknown(false)
  .messages({
    'object.base': 'El cuerpo debe ser un objeto.',
    'object.unknown': 'La petición contiene un campo no permitido.',
    'any.required': 'El cuerpo de la petición es obligatorio.',
  });

export const taskUpdateSchema = Joi.object({
  title: titleRules,
  description: descriptionRules,
  status: statusRules,
  categoryId: categoryIdRules,
  tagIds: tagIdsRules,
})
  .required()
  .unknown(false)
  .messages({
    'object.base': 'El cuerpo debe ser un objeto.',
    'object.unknown': 'La petición contiene un campo no permitido.',
    'any.required': 'El cuerpo de la petición es obligatorio.',
  });

export const taskStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'completed')
    .required()
    .messages({
      'string.base': 'El estado debe ser texto.',
      'any.only': 'El estado debe ser "pending" o "completed".',
      'any.required': 'El estado es obligatorio.',
    }),
})
  .required()
  .unknown(false)
  .messages({
    'object.base': 'El cuerpo debe ser un objeto.',
    'object.unknown': 'La petición contiene un campo no permitido.',
    'any.required': 'El cuerpo de la petición es obligatorio.',
  });

export const taskIdSchema = Joi.string()
  .guid({ version: 'uuidv4' })
  .required()
  .messages({
    'string.base': 'El identificador debe ser texto.',
    'string.empty': 'El identificador es obligatorio.',
    'string.guid': 'El identificador debe ser un UUID válido.',
    'any.required': 'El identificador es obligatorio.',
  });
