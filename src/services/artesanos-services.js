import prisma from '../config/db.js';

// Leer todos los artesanos
export const obtenerArtesanos = async () => {
  return await prisma.artesano.findMany({
    include: { productos: true, stand: true }
  });
};

// Leer un artesano específico por ID
export const obtenerArtesanoPorId = async (id) => {
  return await prisma.artesano.findUnique({
    where: { id: parseInt(id) },
    include: { productos: true, stand: true }
  });
};

// Crear un nuevo artesano
export const crearArtesano = async (data) => {
  // Regla de negocio: Verificar si ya existe un artesano con ese nombre
  const existeArtesano = await prisma.artesano.findFirst({
    where: { nombre: data.nombre }
  });

  if (existeArtesano) {
    throw new Error('Ya existe un artesano con este nombre');
  }

  return await prisma.artesano.create({
    data: {
      nombre: data.nombre,
      localidad: data.localidad
    }
  });
};

// Actualizar un artesano existente
export const actualizarArtesano = async (id, data) => {
  return await prisma.artesano.update({
    where: { id: parseInt(id) },
    data: {
      nombre: data.nombre,
      localidad: data.localidad
    }
  });
};

// Eliminar un artesano
export const eliminarArtesano = async (id) => {
  return await prisma.artesano.delete({
    where: { id: parseInt(id) }
  });
};