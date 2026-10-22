import { Router } from 'express';
import {
  crearAdmin,
  cambiarEstadoCuenta,
  listarUsuarios
} from '../controllers/auth-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import {
  crearAdminSchema,
  cambiarEstadoCuentaSchema
} from '../schemas/auth-validations.js';

const router = Router();

// Rutas protegidas exclusivamente para ADMINISTRADOR
// Orden: autenticación -> cuenta -> rol -> validación -> controlador
router.get(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  listarUsuarios
);

router.post(
  '/admin',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(crearAdminSchema),
  crearAdmin
);

router.patch(
  '/:id/activo',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(cambiarEstadoCuentaSchema),
  cambiarEstadoCuenta
);

export default router;
