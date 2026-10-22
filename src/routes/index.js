import { Router } from 'express';
import authRoutes from './auth-routes.js';
import standsRoutes from './stands-routes.js';
import artesanosRoutes from './artesanos-routes.js';
import productosRoutes from './productos-routes.js';
import localidadesRoutes from './localidades-routes.js';
import ubicacionesRoutes from './ubicaciones-routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/stands', standsRoutes);
router.use('/artesanos', artesanosRoutes);
router.use('/productos', productosRoutes);
router.use('/localidades', localidadesRoutes);
router.use('/ubicaciones', ubicacionesRoutes);

export default router;
