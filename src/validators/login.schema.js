import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .max(254)
    .required()
    .messages({
      'string.base': 'El email debe ser texto.',
      'string.empty': 'El email no puede estar vacío.',
      'string.email': 'El email debe tener un formato válido.',
      'string.max': 'El email no puede superar los 254 caracteres.',
      'any.required': 'El email es obligatorio.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'La contraseña debe ser texto.',
      'string.empty': 'La contraseña no puede estar vacía.',
      'any.required': 'La contraseña es obligatoria.',
    }),
})
  .required()
  .unknown(false)
  .messages({
    'object.base': 'El cuerpo de la petición debe ser un objeto.',
    'object.unknown': 'La petición contiene un campo no permitido.',
    'any.required': 'El cuerpo de la petición es obligatorio.',
  });

export default loginSchema;