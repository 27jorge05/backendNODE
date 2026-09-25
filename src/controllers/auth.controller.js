import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import registerSchema from '../validators/register.schema.js';
import { insertUser } from '../db/user.queries.js';

const BCRYPT_COST = 12;

export async function register(req, res, next) {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  const { name, email, password } = value;

  try {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    await insertUser({
      id,
      name,
      email,
      passwordHash,
    });

    return res.status(201).json({
      data: {
        user: {
          id,
          name,
          email,
        },
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: {
          message: 'No se pudo registrar: el usuario o email ya existe.',
        },
      });
    }

    return next(error);
  }
}