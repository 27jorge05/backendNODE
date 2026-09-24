// PROVISIONAL hasta T08. No es seguridad real: inyecta una identidad de desarrollo.
export default function devAuth(req, res, next) {
  req.auth = { userId: process.env.DEV_USER_ID };
  return next();
}