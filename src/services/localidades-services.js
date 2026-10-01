import { prisma } from '../config/db.js';

export const getAllLocalidades = async () => {
  return await prisma.localidad.findMany({
    include: { artesanos: true }
  });
};

export const createLocalidad = async (data) => {
  return await prisma.localidad.create({ data });
};

export const updateLocalidad = async (id, data) => {
  return await prisma.localidad.update({
    where: { id },
    data
  });
};

export const deleteLocalidad = async (id) => {
  return await prisma.localidad.delete({ where: { id } });
};