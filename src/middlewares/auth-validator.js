export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: "No autorizado. API Key inválida o faltante en el header x-api-key." });
  }
  next();
};
