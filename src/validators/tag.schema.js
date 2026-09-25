import Joi from 'joi';

export const tagBodySchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre debe ser texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.max': 'El nombre no puede superar los 100 caracteres.',
      'any.required': 'El nombre es obligatorio.',
    }),
})
  .required()
  .unknown(false)
  .messages({
    'object.base': 'El cuerpo debe ser un objeto.',
    'object.unknown': 'La petición contiene un campo no permitido.',
    'any.required': 'El cuerpo de la petición es obligatorio.',
  });

export const tagIdSchema = Joi.string()
  .guid({ version: 'uuidv4' })
  .required()
  .messages({
    'string.base': 'El identificador debe ser texto.',
    'string.empty': 'El identificador es obligatorio.',
    'string.guid': 'El identificador debe ser un UUID válido.',
    'any.required': 'El identificador es obligatorio.',
  });