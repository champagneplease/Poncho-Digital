import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import './config/jwt.js';

import authRoutes from './routes/auth-routes.js';
import standsRoutes from './routes/stands-routes.js';
import artesanosRoutes from './routes/artesanos-routes.js';
import productosRoutes from './routes/productos-routes.js';
import localidadesRoutes from './routes/localidades-routes.js';
import ubicacionesRoutes from './routes/ubicaciones-routes.js';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/stands', standsRoutes);
app.use('/artesanos', artesanosRoutes);
app.use('/productos', productosRoutes);
app.use('/localidades', localidadesRoutes);
app.use('/ubicaciones', ubicacionesRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador centralizado de errores (Middleware global)
app.use((err, req, res, next) => {
  console.error("🔥 Error capturado:", err);
  const status = err.status || 500;
  res.status(status).json({
    mensaje: err.message || "Error interno del servidor.",
    ...(process.env.NODE_ENV !== 'production' && { errorCompleto: err })
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
});

export default app;
