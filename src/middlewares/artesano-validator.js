export const validarArtesano = (req, res, next) => {
  const { nombre, localidad } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto válido.' });
  }

  if (!localidad || typeof localidad !== 'string' || localidad.trim() === '') {
    return res.status(400).json({ error: 'La localidad es obligatoria y debe ser un texto válido.' });
  }

  next();
};
