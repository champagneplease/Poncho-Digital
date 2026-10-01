export const validateSchema = (schema) => {
  return (req, res, next) => {
    // safeParse evalúa los datos sin lanzar excepciones que rompan el servidor
    const result = schema.safeParse(req.body);

    // Si la validación falla (success es falso)
    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        // result.error.issues siempre es un array, por lo que el map() no fallará
        detalles: result.error.issues.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message
        }))
      });
    }

    // Si la validación es exitosa, opcionalmente puedes pisar el body 
    // con los datos ya parseados y limpios por Zod
    req.body = result.data; 
    
    // Continuamos hacia el controlador
    next();
  };
};