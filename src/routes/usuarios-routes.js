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

router.get(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Listar todos los usuarios del sistema (solo administradores)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
        description: 'Lista completa de usuarios',
        schema: [{ $ref: '#/components/schemas/UsuarioResponse' }]
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
    return listarUsuarios(req, res, next);
  }
);

router.post(
  '/admin',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(crearAdminSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Crear un nuevo usuario con rol ADMINISTRADOR'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/CrearAdminInput' }
      }
      #swagger.responses[201] = {
        description: 'Administrador creado con éxito',
        schema: { $ref: '#/components/schemas/UsuarioResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos inválidos en el cuerpo de la petición',
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
      #swagger.responses[409] = {
        description: 'Ya existe un usuario con ese email',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return crearAdmin(req, res, next);
  }
);

router.patch(
  '/:id/activo',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(cambiarEstadoCuentaSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Usuarios']
      #swagger.summary = 'Activar o desactivar una cuenta de usuario'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        format: 'uuid',
        description: 'Identificador único UUID del usuario'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/CambiarEstadoCuentaInput' }
      }
      #swagger.responses[200] = {
        description: 'Estado de la cuenta actualizado exitosamente',
        schema: { $ref: '#/components/schemas/UsuarioResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos inválidos o ID no válido',
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
        description: 'Usuario no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[409] = {
        description: 'No se puede desactivar al único administrador activo',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return cambiarEstadoCuenta(req, res, next);
  }
);

export default router;
