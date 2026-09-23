import prisma from '../config/db.js';

export const obtenerTodosLosProductos = async () => {
  return await prisma.producto.findMany({
    include: { artesano: true }
  });
};

export const crearNuevoProducto = async (data) => {
  return await prisma.producto.create({
    data: {
      nombre: data.nombre,
      precio: parseFloat(data.precio),
      artesanoId: parseInt(data.artesanoId)
    }
  });
};






