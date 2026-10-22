export const errorHandler = (err, req, res, next) => {
  if (!err.status || err.status >= 500) {
    console.error("Error no controlado:", err);
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      mensaje: "El recurso solicitado no fue encontrado o no existe."
    });
  }

  if (err.code === 'P2002') {
    const campo = err.meta?.target ? ` (${Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target})` : '';
    return res.status(409).json({
      mensaje: `Ya existe un registro con el valor ingresado${campo}.`
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      mensaje: "El registro referenciado no existe en la base de datos."
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      mensaje: "Formato JSON inválido en el cuerpo de la petición."
    });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    mensaje: err.message || "Error interno del servidor.",
    ...(process.env.NODE_ENV !== 'production' && status === 500 ? { detalle: err.stack } : {})
  });
};
