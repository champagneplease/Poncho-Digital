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
import { artesanoSchema, actualizarEstadoArtesanoSchema } from '../schemas/validations.js';
import { postulacionSchema } from '../schemas/auth-validations.js';

const router = Router();

router.get('/', (req, res, next) => {
  /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Listar todos los artesanos registrados'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de artesanos con sus localidades, stands y productos',
      schema: [{ $ref: '#/components/schemas/ArtesanoResponse' }]
    }
  */
  return getArtesanos(req, res, next);
});

router.get('/:id', (req, res, next) => {
  /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Obtener artesano por su identificador UUID'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      format: 'uuid',
      description: 'Identificador UUID del artesano'
    }
    #swagger.responses[200] = {
      description: 'Datos del artesano encontrado',
      schema: { $ref: '#/components/schemas/ArtesanoResponse' }
    }
    #swagger.responses[404] = {
      description: 'Artesano no encontrado',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return getArtesanoById(req, res, next);
});

router.post('/postulacion', validateSchema(postulacionSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Artesanos']
    #swagger.summary = 'Registrar postulación pública de artesano (alias)'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/PostulacionInput' }
    }
    #swagger.responses[201] = {
      description: 'Postulación registrada en estado pendiente',
      schema: { $ref: '#/components/schemas/PostulacionResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos de postulación inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[409] = {
      description: 'Email ya registrado',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return postular(req, res, next);
});

router.post(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(artesanoSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Artesanos']
      #swagger.summary = 'Crear un nuevo perfil de artesano'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ArtesanoInput' }
      }
      #swagger.responses[201] = {
        description: 'Perfil de artesano creado exitosamente',
        schema: { $ref: '#/components/schemas/ArtesanoResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos inválidos en el cuerpo de la solicitud',
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
    return createArtesano(req, res, next);
  }
);

router.put(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(artesanoSchema.partial()),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Artesanos']
      #swagger.summary = 'Actualizar datos de un artesano'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        format: 'uuid',
        description: 'Identificador UUID del artesano'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ArtesanoUpdateInput' }
      }
      #swagger.responses[200] = {
        description: 'Artesano actualizado con éxito',
        schema: { $ref: '#/components/schemas/ArtesanoResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos inválidos',
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
        description: 'Artesano no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return updateArtesano(req, res, next);
  }
);

router.patch(
  '/:id/estado',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  validateSchema(actualizarEstadoArtesanoSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Artesanos']
      #swagger.summary = 'Actualizar estado de aprobación de un artesano'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        format: 'uuid',
        description: 'Identificador UUID del artesano'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ArtesanoEstadoInput' }
      }
      #swagger.responses[200] = {
        description: 'Estado del artesano actualizado',
        schema: { $ref: '#/components/schemas/ArtesanoResponse' }
      }
      #swagger.responses[400] = {
        description: 'Estado inválido. Debe ser PENDIENTE, APROBADO o RECHAZADO',
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
        description: 'Artesano no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return updateArtesanoEstado(req, res, next);
  }
);

router.delete(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ADMINISTRADOR'),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Artesanos']
      #swagger.summary = 'Eliminar un artesano'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'string',
        format: 'uuid',
        description: 'Identificador UUID del artesano'
      }
      #swagger.responses[204] = {
        description: 'Artesano eliminado exitosamente'
      }
      #swagger.responses[400] = {
        description: 'ID inválido o cabecera mal formada',
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
        description: 'Artesano no encontrado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return deleteArtesano(req, res, next);
  }
);

export default router;
