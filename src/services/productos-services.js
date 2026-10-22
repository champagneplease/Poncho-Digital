import { prisma } from '../config/db.js';

export const getAllProductos = async () => {
  return await prisma.producto.findMany({
    include: { artesano: true }
  });
};

export const getProductoById = async (id) => {
  return await prisma.producto.findUnique({
    where: { id },
    include: { artesano: true }
  });
};

export const createProducto = async (data) => {
  return await prisma.producto.create({ data });
};

export const updateProducto = async (id, data, artesanoId) => {
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  if (artesanoId && producto.artesanoId && producto.artesanoId !== artesanoId) {
    const error = new Error("No tienes permiso para modificar este producto.");
    error.status = 403;
    throw error;
  }

  return await prisma.producto.update({
    where: { id },
    data
  });
};

export const deleteProducto = async (id, artesanoId) => {
  const producto = await prisma.producto.findUnique({ where: { id } });
  if (!producto) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  if (artesanoId && producto.artesanoId && producto.artesanoId !== artesanoId) {
    const error = new Error("No tienes permiso para eliminar este producto.");
    error.status = 403;
    throw error;
  }

  return await prisma.producto.delete({ where: { id } });
};
