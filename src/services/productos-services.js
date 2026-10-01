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

export const updateProducto = async (id, data) => {
  return await prisma.producto.update({
    where: { id },
    data
  });
};

export const deleteProducto = async (id) => {
  return await prisma.producto.delete({ where: { id } });
};
