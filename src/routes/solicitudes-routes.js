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
  (req, res, next) => {
    /* 
      #swagger.tags = ['Solicitudes']
      #swagger.summary = 'Listar solicitudes de artesanos pendientes y resueltas (solo administradores)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
        description: 'Lista completa de solicitudes de postulación',
        schema: [{ $ref: '#/components/schemas/SolicitudResponse' }]
      }
      #swagger.responses[400] = {
        description: 'Cabecera Authorization mal formada',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[401] = {
        description: 'No autenticado o token inválido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[403] = {
        description: 'Acceso prohibido. Se requiere rol ADMINISTRADOR',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return listarSolicitudes(req, res, next);
  }
);

router.patch(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(resolverSolicitudSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Solicitudes']
      #swagger.summary = 'Aprobar o rechazar una solicitud de postulación de artesano'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        minimum: 1,
        description: 'ID numérico de la solicitud'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ResolverSolicitudInput' }
      }
      #swagger.responses[200] = {
        description: 'Solicitud resuelta exitosamente (APROBADA o RECHAZADA)',
        schema: { $ref: '#/components/schemas/ResolverSolicitudResponse' }
      }
      #swagger.responses[400] = {
        description: 'ID no numérico o estado no válido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[401] = {
        description: 'No autenticado o token inválido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[403] = {
        description: 'Acceso prohibido. Se requiere rol ADMINISTRADOR',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[404] = {
        description: 'Solicitud no encontrada',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[409] = {
        description: 'La solicitud ya fue resuelta previamente',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return resolverSolicitud(req, res, next);
  }
);

export default router;
