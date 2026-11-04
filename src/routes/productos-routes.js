import { Router } from 'express';
import {
  getProductos,
  getProductoById,
  getMisProductos,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productos-controllers.js';
import {
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles,
  validateSchema
} from '../middlewares/auth-middlewares.js';
import { productoSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', (req, res, next) => {
  /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Listar todos los productos disponibles'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Lista de productos con información de su artesano',
      schema: [{ $ref: '#/components/schemas/ProductoResponse' }]
    }
  */
  return getProductos(req, res, next);
});

router.get(
  '/mis-productos',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ARTESANO'),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Productos']
      #swagger.summary = 'Listar productos pertenecientes al artesano autenticado'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.responses[200] = {
        description: 'Lista de productos propios del artesano',
        schema: [{ $ref: '#/components/schemas/ProductoResponse' }]
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
        description: 'Acceso prohibido. Se requiere rol ARTESANO',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return getMisProductos(req, res, next);
  }
);

router.get('/:id', (req, res, next) => {
  /* 
    #swagger.tags = ['Productos']
    #swagger.summary = 'Obtener un producto por su ID numérico'
    #swagger.security = []
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      minimum: 1,
      description: 'ID numérico del producto'
    }
    #swagger.responses[200] = {
      description: 'Producto encontrado con sus datos',
      schema: { $ref: '#/components/schemas/ProductoResponse' }
    }
    #swagger.responses[400] = {
      description: 'El ID del producto debe ser numérico',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[404] = {
      description: 'Producto no encontrado',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return getProductoById(req, res, next);
});

router.post(
  '/',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ARTESANO'),
  validateSchema(productoSchema),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Productos']
      #swagger.summary = 'Publicar un nuevo producto artesanal (solo artesanos)'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ProductoInput' }
      }
      #swagger.responses[201] = {
        description: 'Producto creado exitosamente asociado al artesano autenticado',
        schema: { $ref: '#/components/schemas/ProductoResponse' }
      }
      #swagger.responses[400] = {
        description: 'Datos del producto inválidos o campos no permitidos presentes',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[401] = {
        description: 'No autenticado o token inválido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[403] = {
        description: 'Acceso prohibido. Requiere rol ARTESANO con perfil habilitado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return createProducto(req, res, next);
  }
);

router.put(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ARTESANO'),
  validateSchema(productoSchema.partial()),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Productos']
      #swagger.summary = 'Actualizar un producto propio del artesano autenticado'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        minimum: 1,
        description: 'ID numérico del producto'
      }
      #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/ProductoUpdateInput' }
      }
      #swagger.responses[200] = {
        description: 'Producto actualizado con éxito',
        schema: { $ref: '#/components/schemas/ProductoResponse' }
      }
      #swagger.responses[400] = {
        description: 'ID no numérico o datos de actualización inválidos',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[401] = {
        description: 'No autenticado o token inválido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[403] = {
        description: 'Acceso prohibido. Requiere rol ARTESANO',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[404] = {
        description: 'Producto no encontrado o no pertenece al artesano autenticado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return updateProducto(req, res, next);
  }
);

router.delete(
  '/:id',
  autenticarUsuario,
  cargarContextoCuenta,
  autorizarRoles('ARTESANO'),
  (req, res, next) => {
    /* 
      #swagger.tags = ['Productos']
      #swagger.summary = 'Eliminar un producto propio del artesano autenticado'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        minimum: 1,
        description: 'ID numérico del producto'
      }
      #swagger.responses[204] = {
        description: 'Producto eliminado exitosamente'
      }
      #swagger.responses[400] = {
        description: 'El ID del producto debe ser numérico',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[401] = {
        description: 'No autenticado o token inválido',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[403] = {
        description: 'Acceso prohibido. Requiere rol ARTESANO',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
      #swagger.responses[404] = {
        description: 'Producto no encontrado o no pertenece al artesano autenticado',
        schema: { $ref: '#/components/schemas/ErrorApi' }
      }
    */
    return deleteProducto(req, res, next);
  }
);

export default router;
