export const validateSchema = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    req.body = result.data; 
    next();
  };
};