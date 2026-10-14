import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

const FACTOR_COSTO = 10;

export const registrarArtesano = async (dto) => {
  const { nombre, apellido, email, password } = dto;
  
  const usuarioExistente = await prisma.artesano.findUnique({ where: { email: email } });
  if (usuarioExistente) {
    const error = new Error("Ya existe usuario con ese email.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
  
  return prisma.artesano.create({
    data: { nombre, apellido, email, passwordHash },
    select: { id: true, nombre: true, email: true }
  });
};

export const iniciarSesion = async (dto) => {
  const { email, password } = dto;
  const artesano = await prisma.artesano.findUnique({ where: { email: email } });
  
  if (!artesano) {
    const error = new Error("Las credenciales son inválidas.");
    error.status = 401;
    throw error;
  }

  const passwordValida = await bcrypt.compare(password, artesano.passwordHash);
  if (!passwordValida) {
    const error = new Error("Las credenciales son inválidas.");
    error.status = 401;
    throw error;
  }

  if (artesano.activo === false) {
    const error = new Error("Acceso prohibido.");
    error.status = 403;
    throw error;
  }

  await prisma.artesano.update({
    where: { id: artesano.id },
    data: { ultimoAcceso: new Date() }
  });

  return { id: artesano.id, nombre: artesano.nombre, email: artesano.email };
};