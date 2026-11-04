import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import './config/jwt.js';

import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { iniciarCronTokens } from './tasks/cleanup-tokens.js';

const app = express();

app.use(express.json());

// Enrutador principal de la API
app.use(apiRoutes);

// Publicación de la documentación de Swagger en /docs
const swaggerFilePath = new URL('../swagger-output.json', import.meta.url);
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// Manejador global centralizado de errores
app.use(errorHandler);

// En entorno de pruebas (NODE_ENV=test) no se levanta el servidor ni se ejecutan tareas cron periódicas
if (process.env.NODE_ENV !== 'test') {
  iniciarCronTokens();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
  });
}

export default app;
