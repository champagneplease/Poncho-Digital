import { prisma } from '../config/db.js';

export const getAllStands = async (queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 10;
  const skip = (page - 1) * limit;

  const { estado, pabellon, localidad } = queryParams;
  const where = {};
  
  if (estado) where.estado = estado; 
  if (pabellon) where.ubicacion = { pabellon: pabellon };
  if (localidad) {
    where.artesano = {
      localidad: { nombre: { contains: localidad, mode: 'insensitive' } }
    };
  }

  const stands = await prisma.stand.findMany({
    where, skip, take: limit,
    include: {
      ubicacion: true,
      artesano: { include: { localidad: true } }
    }
  });

  const totalRegistros = await prisma.stand.count({ where });

  return {
    data: stands,
    meta: {
      total: totalRegistros,
      paginaActual: page,
      limite: limit,
      totalPaginas: Math.ceil(totalRegistros / limit)
    }
  };
};

export const createStand = async (data) => {
  return await prisma.stand.create({ data });
};

export const updateStand = async (id, data) => {
  if (data.artesanoId !== undefined) {
    if (data.artesanoId !== null) {
      const artesano = await prisma.artesano.findUnique({ where: { id: data.artesanoId } });
      if (!artesano) {
        const error = new Error("El artesano no existe.");
        error.status = 400;
        throw error;
      }
      if (artesano.estado !== "APROBADO") {
        const error = new Error("El artesano debe estar APROBADO para asignarle un stand.");
        error.status = 400;
        throw error;
      }
      data.estado = "ocupado";
    } else {
      data.estado = "disponible";
    }
  }

  return await prisma.stand.update({
    where: { id },
    data
  });
};

export const deleteStand = async (id) => {
  return await prisma.stand.delete({ where: { id } });
};