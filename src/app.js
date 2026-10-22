import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './config/jwt.js';

import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { iniciarCronTokens } from './tasks/cleanup-tokens.js';

const app = express();

app.use(express.json());

app.use(apiRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

app.use(errorHandler);

iniciarCronTokens();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
});

export default app;
