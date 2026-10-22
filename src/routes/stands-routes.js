import { Router } from 'express';
import { getStands, createStand, updateStand, deleteStand } from '../controllers/stands-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import { standSchema } from '../schemas/validations.js';

const router = Router();

// Consulta pública
router.get('/', getStands);

// Rutas protegidas solo para ADMINISTRADOR
// Orden en la ruta: autenticación -> cuenta -> rol -> validación -> controlador
router.post(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(standSchema),
  createStand
);

router.put(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(standSchema.partial()),
  updateStand
);

router.delete(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  deleteStand
);

export default router;