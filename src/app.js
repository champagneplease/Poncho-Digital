
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';


// Importación de todas las rutas
import standsRoutes from './routes/stands-routes.js';
import artesanosRoutes from './routes/artesanos-routes.js';
import productosRoutes from './routes/productos-routes.js';
import localidadesRoutes from './routes/localidades-routes.js';
import ubicacionesRoutes from './routes/ubicaciones-routes.js';

const app = express();

// --- Middlewares Globales ---
app.use(express.json()); 

// --- Rutas de la API ---
app.use('/stands', standsRoutes);
app.use('/artesanos', artesanosRoutes);
app.use('/productos', productosRoutes);
app.use('/localidades', localidadesRoutes);
app.use('/ubicaciones', ubicacionesRoutes);

// --- Manejo de rutas inexistentes (404) ---
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// --- Configuración del Puerto y Arranque del Servidor ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Servidor de Poncho Digital corriendo en http://localhost:${PORT}`);
});