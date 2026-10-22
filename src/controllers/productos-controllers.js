import * as productoService from '../services/productos-services.js';

export const getProductos = async (req, res, next) => {
  try {
    const productos = await productoService.getAllProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

export const getProductoById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

export const createProducto = async (req, res, next) => {
  try {
    const artesanoId = req.artesano?.id || req.body.artesanoId;

    const nuevoProducto = await productoService.createProducto({
      ...req.body,
      ...(artesanoId && { artesanoId })
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProducto = await productoService.updateProducto(id, req.body);
    res.json(updatedProducto);
  } catch (error) {
    next(error);
  }
};

export const deleteProducto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await productoService.deleteProducto(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
