import { verifyAccessToken } from '../utils/jwt.js';

export default function authRequired(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'Se requiere autenticación.',
      },
    });
  }

  const token = header.slice('Bearer '.length);

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'La sesión ha expirado.'
      : 'Token inválido.';

    return res.status(401).json({ error: { message } });
  }

  if (typeof payload.sub !== 'string') {
    return res.status(401).json({
      error: {
        message: 'Token inválido.',
      },
    });
  }

  req.auth = { userId: payload.sub };
  return next();
}