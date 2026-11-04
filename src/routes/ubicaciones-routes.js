import { Router } from 'express';
import { getUbicaciones, createUbicacion, updateUbicacion, deleteUbicacion } from '../controllers/ubicaciones-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { ubicacionSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', (req, res, next) => {
  /* 
    #swagger.tags = ['Ubicaciones']
    #swagger.summary = 'Listar todas las ubicaciones'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de ubicaciones',
      schema: [{ $ref: '#/components/schemas/UbicacionResponse' }]
    }
  */
  return getUbicaciones(req, res, next);
});

router.post('/', validateSchema(ubicacionSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Ubicaciones']
    #swagger.summary = 'Crear una ubicación'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/UbicacionInput' }
    }
    #swagger.responses[201] = {
      description: 'Ubicación creada con éxito',
      schema: { $ref: '#/components/schemas/UbicacionResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return createUbicacion(req, res, next);
});

router.put('/:id', validateSchema(ubicacionSchema.partial()), (req, res, next) => {
  /* 
    #swagger.tags = ['Ubicaciones']
    #swagger.summary = 'Actualizar una ubicación'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de la ubicación'
    }
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/UbicacionUpdateInput' }
    }
    #swagger.responses[200] = {
      description: 'Ubicación actualizada',
      schema: { $ref: '#/components/schemas/UbicacionResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return updateUbicacion(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  /* 
    #swagger.tags = ['Ubicaciones']
    #swagger.summary = 'Eliminar una ubicación'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de la ubicación'
    }
    #swagger.responses[204] = {
      description: 'Ubicación eliminada'
    }
  */
  return deleteUbicacion(req, res, next);
});

export default router;
