import { Router } from 'express';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../controllers/productos-controllers.js';
import { autenticarArtesano, validarEsquema } from '../middlewares/auth-middlewares.js';
import { productoSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getProductos);
router.post('/', autenticarArtesano, validarEsquema(productoSchema), createProducto);
router.put('/:id', autenticarArtesano, validarEsquema(productoSchema.partial()), updateProducto);
router.delete('/:id', autenticarArtesano, deleteProducto);

export default router;