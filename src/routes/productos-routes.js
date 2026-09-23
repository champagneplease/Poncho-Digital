import { Router } from 'express';
import { getProductos, createProducto } from '../controllers/productos-controllers.js';

const router = Router();

// Endpoint: /api/productos
router.get('/', getProductos);
router.post('/', createProducto);

export default router;