import { prisma } from '../config/db.js';


export const getAllUbicaciones = async () => {
  return await prisma.ubicacion.findMany({
    include: { stands: true }
  });
};

export const createUbicacion = async (data) => {
  return await prisma.ubicacion.create({ data });
};

export const updateUbicacion = async (id, data) => {
  return await prisma.ubicacion.update({
    where: { id },
    data
  });
};

export const deleteUbicacion = async (id) => {
  return await prisma.ubicacion.delete({ where: { id } });
};