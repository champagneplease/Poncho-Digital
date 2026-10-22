import { prisma } from '../config/db.js';

export const getAllArtesanos = async () => {
  return await prisma.artesano.findMany({
    include: { localidad: true, stand: true, productos: true }
  });
};

export const getArtesanoById = async (id) => {
  return await prisma.artesano.findUnique({
    where: { id },
    include: { localidad: true, stand: true, productos: true }
  });
};

export const createArtesano = async (data) => {
  return await prisma.artesano.create({ data });
};

export const updateArtesano = async (id, data) => {
  return await prisma.artesano.update({
    where: { id },
    data
  });
};

export const deleteArtesano = async (id) => {
  return await prisma.artesano.delete({ where: { id } });
};

export const updateArtesanoEstado = async (id, estado) => {
  return await prisma.artesano.update({
    where: { id },
    data: { estado }
  });
};