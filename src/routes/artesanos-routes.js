import { Router } from 'express';
import {
  getArtesanos,
  getArtesanoById,
  createArtesano,
  updateArtesano,
  updateArtesanoEstado,
  deleteArtesano
} from '../controllers/artesanos-controllers.js';
import { postular } from '../controllers/auth-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import { artesanoSchema } from '../schemas/validations.js';
import { postulacionSchema } from '../schemas/auth-validations.js';

const router = Router();

// Consultas públicas
router.get('/', getArtesanos);
router.get('/:id', getArtesanoById);

// Postulación pública
router.post('/postulacion', validateSchema(postulacionSchema), postular);

// Endpoints protegidos para ADMINISTRADOR
// Orden: autenticación -> cuenta -> rol -> validación -> controlador
router.post(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(artesanoSchema),
  createArtesano
);

router.put(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(artesanoSchema.partial()),
  updateArtesano
);

router.patch(
  '/:id/estado',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  updateArtesanoEstado
);

router.delete(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  deleteArtesano
);

export default router;
