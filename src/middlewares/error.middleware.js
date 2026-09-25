export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        message: 'El cuerpo de la petición debe contener JSON válido.',
      },
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        message: 'El cuerpo de la petición es demasiado grande.',
      },
    });
  }

  console.error('Error interno:', error.code ?? error.name);

  return res.status(500).json({
    error: {
      message: 'Ocurrió un error interno del servidor.',
    },
  });
}