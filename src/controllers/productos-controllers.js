import * as productosService from '../services/productos-services.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const createProducto = async (req, res, next) => {
  try {
    const artesanoId = req.artesano.id;

    const nuevoProducto = await productosService.createProducto({
      ...req.body,
      artesanoId
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedProducto = await productoService.updateProducto(id, req.body);
    res.json(updatedProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto o no existe" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productoService.deleteProducto(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto o no existe" });
  }
};