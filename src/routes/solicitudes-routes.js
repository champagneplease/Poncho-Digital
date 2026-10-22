import { Router } from 'express';
import {
  listarSolicitudes,
  resolverSolicitud
} from '../controllers/auth-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import { resolverSolicitudSchema } from '../schemas/auth-validations.js';

const router = Router();

router.get(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  listarSolicitudes
);

router.patch(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(resolverSolicitudSchema),
  resolverSolicitud
);

export default router;
