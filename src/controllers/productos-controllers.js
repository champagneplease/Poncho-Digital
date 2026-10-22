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
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID del producto debe ser numérico." });
    }
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

export const getMisProductos = async (req, res, next) => {
  try {
    const artesanoId = req.usuario.artesanoId;
    if (!artesanoId) {
      return res.status(403).json({ mensaje: "No tienes un perfil de artesano vinculado." });
    }
    const productos = await productoService.getMisProductos(artesanoId);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

export const createProducto = async (req, res, next) => {
  try {
    const artesanoId = req.usuario.artesanoId;
    if (!artesanoId) {
      return res.status(403).json({ mensaje: "Debes tener un perfil de artesano habilitado para publicar productos." });
    }

    const { nombre, precio } = req.body;
    const nuevoProducto = await productoService.createProducto({
      nombre,
      precio,
      artesanoId
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID del producto debe ser numérico." });
    }

    const artesanoId = req.usuario.artesanoId;
    if (!artesanoId) {
      return res.status(403).json({ mensaje: "No tienes un perfil de artesano vinculado." });
    }

    const { nombre, precio } = req.body;
    const datosActualizacion = {};
    if (nombre !== undefined) datosActualizacion.nombre = nombre;
    if (precio !== undefined) datosActualizacion.precio = precio;

    const updatedProducto = await productoService.updateProducto(id, datosActualizacion, artesanoId);
    res.json(updatedProducto);
  } catch (error) {
    next(error);
  }
};

export const deleteProducto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID del producto debe ser numérico." });
    }

    const artesanoId = req.usuario.artesanoId;
    if (!artesanoId) {
      return res.status(403).json({ mensaje: "No tienes un perfil de artesano vinculado." });
    }

    await productoService.deleteProducto(id, artesanoId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
