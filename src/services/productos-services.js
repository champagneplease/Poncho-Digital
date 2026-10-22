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

export const getMisProductos = async (artesanoId) => {
  return await prisma.producto.findMany({
    where: { artesanoId },
    include: { artesano: true }
  });
};

export const createProducto = async (data) => {
  return await prisma.producto.create({ data });
};

export const updateProducto = async (id, data, artesanoId) => {
  // Modificar filtra por id y por el propietario en la misma consulta del servicio
  const resultado = await prisma.producto.updateMany({
    where: {
      id,
      artesanoId
    },
    data
  });

  // Producto ajeno o inexistente -> 404 con el mismo mensaje según rúbrica
  if (resultado.count === 0) {
    const error = new Error("Producto no encontrado.");
    error.status = 404;
    throw error;
  }

  return await prisma.producto.findUnique({ where: { id } });
};

export const deleteProducto = async (id, artesanoId) => {
  // Eliminar filtra por id y por el propietario en la misma consulta del servicio
  const resultado = await prisma.producto.deleteMany({
    where: {
      id,
      artesanoId
    }
  });

  // Producto ajeno o inexistente -> 404 con el mismo mensaje según rúbrica
  if (resultado.count === 0) {
    const error = new Error("Producto no encontrado.");
    error.status = 404;
    throw error;
  }
};
