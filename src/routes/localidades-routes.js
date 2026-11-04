import { Router } from 'express';
import { getLocalidades, createLocalidad, updateLocalidad, deleteLocalidad } from '../controllers/localidades-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { localidadSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', (req, res, next) => {
  /* 
    #swagger.tags = ['Localidades']
    #swagger.summary = 'Listar todas las localidades'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de localidades',
      schema: [{ $ref: '#/components/schemas/LocalidadResponse' }]
    }
  */
  return getLocalidades(req, res, next);
});

router.post('/', validateSchema(localidadSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Localidades']
    #swagger.summary = 'Crear una localidad'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/LocalidadInput' }
    }
    #swagger.responses[201] = {
      description: 'Localidad creada con éxito',
      schema: { $ref: '#/components/schemas/LocalidadResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return createLocalidad(req, res, next);
});

router.put('/:id', validateSchema(localidadSchema.partial()), (req, res, next) => {
  /* 
    #swagger.tags = ['Localidades']
    #swagger.summary = 'Actualizar una localidad'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de la localidad'
    }
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/LocalidadUpdateInput' }
    }
    #swagger.responses[200] = {
      description: 'Localidad actualizada',
      schema: { $ref: '#/components/schemas/LocalidadResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return updateLocalidad(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  /* 
    #swagger.tags = ['Localidades']
    #swagger.summary = 'Eliminar una localidad'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID de la localidad'
    }
    #swagger.responses[204] = {
      description: 'Localidad eliminada'
    }
  */
  return deleteLocalidad(req, res, next);
});

export default router;
