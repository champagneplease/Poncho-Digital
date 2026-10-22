import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './config/jwt.js';

import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { iniciarCronTokens } from './tasks/cleanup-tokens.js';

const app = express();

app.use(express.json());

// Rutas de la API
app.use(apiRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// Manejador centralizado de errores (Middleware global)
app.use(errorHandler);

// Inicializar tareas programadas
iniciarCronTokens();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
});

export default app;
