import prisma from '../config/db.js';

// Leer todos los stands (sin filtros)
export const obtenerStands = async () => {
  return await prisma.stand.findMany();
};

// Leer un stand específico por ID
export const obtenerStandPorId = async (id) => {
  return await prisma.stand.findUnique({
    where: { id: parseInt(id) }
  });
};

// Crear un nuevo stand
export const crearStand = async (data) => {
  return await prisma.stand.create({
    data: {
      pabellon: data.pabellon,
      sector: data.sector,
      estado: data.estado || 'disponible',
      coordenadas: data.coordenadas
    }
  });
};

// Actualizar un stand existente
export const actualizarStand = async (id, data) => {
  return await prisma.stand.update({
    where: { id: parseInt(id) },
    data: data
  });
};

// Eliminar un stand
export const eliminarStand = async (id) => {
  return await prisma.stand.delete({
    where: { id: parseInt(id) }
  });
};