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

router.get('/', (req, res, next) => {
  /* 
    #swagger.tags = ['Stands']
    #swagger.summary = 'Listar stands con filtros y paginación'
    #swagger.security = []
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'integer',
      minimum: 1,
      default: 1,
      description: 'Número de página para paginación'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
      description: 'Cantidad de stands por página'
    }
    #swagger.parameters['estado'] = {
      in: 'query',
      type: 'string',
      description: 'Filtrar por estado del stand (ej: disponible, ocupado)'
    }
    #swagger.parameters['pabellon'] = {
      in: 'query',
      type: 'string',
      description: 'Filtrar por nombre del pabellón'
    }
    #swagger.parameters['localidad'] = {
      in: 'query',
      type: 'string',
      description: 'Filtrar por nombre de localidad del artesano'
    }
    #swagger.responses[200] = {
      description: 'Listado paginado de stands',
      schema: { $ref: '#/components/schemas/StandPaginadoResponse' }
    }
  */
  return getStands(req, res, next);
});

router.post(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(standSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Stands']
      #swagger.summary = 'Crear un nuevo stand en el predio (solo administradores)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/StandInput' }
      }
      #swagger.responses[201] = {
        description: 'Stand creado exitosamente',
        schema: { $ref: '#/components/schemas/StandResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos inválidos o ubicación inexistente',
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
    return createStand(req, res, next);
  }
);

router.put(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(standSchema.partial()),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Stands']
      #swagger.summary = 'Actualizar datos de un stand (solo administradores)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        minimum: 1,
        description: 'ID numérico del stand'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/StandUpdateInput' }
      }
      #swagger.responses[200] = {
        description: 'Stand actualizado con éxito',
        schema: { $ref: '#/components/schemas/StandResponse' }
      }
      #swagger.responses[400] = {
        description: 'ID no numérico o datos inválidos',
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
        description: 'Stand no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return updateStand(req, res, next);
  }
);

router.delete(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Stands']
      #swagger.summary = 'Eliminar un stand existente (solo administradores)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        minimum: 1,
        description: 'ID numérico del stand'
      }
      #swagger.responses[204] = {
        description: 'Stand eliminado exitosamente'
      }
      #swagger.responses[400] = {
        description: 'El ID del stand debe ser numérico',
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
        description: 'Stand no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return deleteStand(req, res, next);
  }
);

export default router;
