import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import { insertUser, findUserByEmail } from '../db/user.queries.js';
import { decorateUser } from '../decorators/user.decorator.js';
import registerSchema from '../validators/register.schema.js';
import loginSchema from '../validators/login.schema.js';
import { signAccessToken } from '../utils/jwt.js';

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
        user: decorateUser({ id, name, email }),
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
export async function login(req, res, next) {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
      },
    });
  }

  const { email, password } = value;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Correo o contraseña incorrectos.',
        },
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: {
          message: 'Correo o contraseña incorrectos.',
        },
      });
    }

    const token = signAccessToken(user.id);

    return res.status(200).json({
      data: {
        token,
        user: decorateUser(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res) {
  return res.status(204).end();
}