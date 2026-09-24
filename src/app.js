import express from 'express';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos-routes.js';
import standsRoutes from './routes/stands-routes.js';
import artesanosRoutes from './routes/artesanos-routes.js';

dotenv.config();

const app = express();

// Middleware para que Express entienda el formato JSON
app.use(express.json());

// Registramos los endpoints principales
app.use('/api/productos', productosRoutes);
app.use('/api/stands', standsRoutes);       
app.use('/api/artesanos', artesanosRoutes);

// Middleware centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});