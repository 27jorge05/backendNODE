import Joi from 'joi';

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.base': 'El nombre debe ser texto.',
            'string.empty': 'El nombre estar vacio.',
            'string.max': 'El nombre no puede superar los 100 caracteres.',
            'any.required': 'El nombre es obligatorio.',
        }),

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
        .min(8)
        .max(72, 'utf8')
        .required()
        .messages({
            'string.base': 'La contraseña debe ser texto.',
            'string.empty': 'La contraseña no puede estar vacía.',
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
            'string.max': 'La contraseña no puede superar los 72 bytes.',
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

export default registerSchema;