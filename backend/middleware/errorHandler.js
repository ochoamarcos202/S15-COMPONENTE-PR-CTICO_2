const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  
  if (err.name === 'ValidationError') {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Error de validacion', errores });
  }

  
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {}).join(', ');
    return res.status(409).json({ mensaje: `Ya existe un registro con ese valor en: ${campo}` });
  }

  
  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: `Identificador invalido: ${err.value}` });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  return res.status(statusCode).json({
    mensaje: err.mensaje || err.message || 'Error interno del servidor',
  });
};

const rutaNoEncontrada = (req, res, next) => {
  res.status(404);
  next(new Error(`Ruta no encontrada: ${req.originalUrl}`));
};

module.exports = { errorHandler, rutaNoEncontrada };
