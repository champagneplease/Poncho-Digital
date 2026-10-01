import * as productoService from '../services/productos-services.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const newProducto = await productoService.createProducto(req.body);
    res.status(201).json(newProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
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
}