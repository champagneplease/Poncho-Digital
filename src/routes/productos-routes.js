import { Router } from 'express';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../controllers/productos-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { productoSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getProductos);
router.post('/', validateSchema(productoSchema), createProducto);
router.put('/:id', validateSchema(productoSchema.partial()), updateProducto);
router.delete('/:id', deleteProducto);

export default router;