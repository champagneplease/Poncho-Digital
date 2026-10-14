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

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    mensaje: status === 500 ? "Error interno del servidor." : err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
});

// --- Manejador centralizado de errores (Middleware global) ---
app.use((err, req, res, next) => {
  // Imprime el error real en tu terminal de VS Code
  console.error("🔥 Error capturado:", err);

  const status = err.status || 500;
  res.status(status).json({
    mensaje: err.message || "Error interno del servidor.",
    errorCompleto: err // Muestra el detalle exacto en Postman
  });
});