import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  getMisProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productos-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import { productoSchema } from '../schemas/validations.js';

const router = Router();

// Rutas públicas de consulta
router.get('/', getProductos);
// Listado propio para artesanos (debe ir antes de /:id para no colisionar)
router.get('/mis-productos', autenticarUsuario, cargarContextoCuenta, autorizarRoles('ARTESANO'), getMisProductos);
router.get('/:id', getProductoById);

// Rutas protegidas exclusivas para ARTESANO
// Orden de middlewares: autenticación -> cuenta -> rol -> validación -> controlador
router.post('/', autenticarUsuario, cargarContextoCuenta, autorizarRoles('ARTESANO'), validateSchema(productoSchema), createProducto);
router.put('/:id', autenticarUsuario, cargarContextoCuenta, autorizarRoles('ARTESANO'), validateSchema(productoSchema.partial()), updateProducto);
router.delete('/:id', autenticarUsuario, cargarContextoCuenta, autorizarRoles('ARTESANO'), deleteProducto);

export default router;