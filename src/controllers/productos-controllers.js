import * as productoService from '../services/productos-services.js';

export const getProductos = async (req, res, next) => {
  try {
    const productos = await productoService.obtenerTodosLosProductos();
    res.status(200).json(productos);
  } catch (error) {
    next(error); // Pasa el error al middleware global
  }
};

export const createProducto = async (req, res, next) => {
  try {
    const nuevoProducto = await productoService.crearNuevoProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};