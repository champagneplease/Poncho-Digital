import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";

const FACTOR_COSTO = 10;

export const registrarUsuario = async (dto) => {
  const { nombre, email, password } = dto;
  
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    const error = new Error("Ya existe usuario con ese email.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
  
  return prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash,
      rol: "ARTESANO",
      activo: true
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true
    }
  });
};

export const registrarArtesano = registrarUsuario;

export const iniciarSesion = async (dto) => {
  const { email, password } = dto;
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { artesano: true }
  });
  
  if (!usuario) {
    const error = new Error("Las credenciales son inválidas.");
    error.status = 401;
    throw error;
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    const error = new Error("Las credenciales son inválidas.");
    error.status = 401;
    throw error;
  }

  if (usuario.activo === false) {
    const error = new Error("Las credenciales son inválidas.");
    error.status = 401;
    throw error;
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcceso: new Date() }
  });

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    artesanoId: usuario.artesano?.id || null
  };
};

export const obtenerPerfilMe = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      ultimoAcceso: true,
      artesano: {
        include: { localidad: true, stand: true }
      }
    }
  });

  if (!usuario) {
    const error = new Error("La cuenta ya no existe.");
    error.status = 401;
    throw error;
  }

  return usuario;
};

export const postularArtesano = async (dto) => {
  const { nombre, apellido, email, password, telefono, localidadId, motivo } = dto;
  
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    const error = new Error("Ya existe una cuenta registrada con ese email.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

  return await prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol: "POSTULANTE",
        activo: true
      }
    });

    const artesano = await tx.artesano.create({
      data: {
        nombre,
        apellido,
        telefono,
        estado: "PENDIENTE",
        usuarioId: usuario.id,
        ...(localidadId && { localidadId })
      }
    });

    const solicitud = await tx.solicitud.create({
      data: {
        usuarioId: usuario.id,
        artesanoId: artesano.id,
        estado: "PENDIENTE",
        motivo: motivo || "Postulación pública de artesano"
      }
    });

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      artesano: { id: artesano.id, estado: artesano.estado },
      solicitud: { id: solicitud.id, estado: solicitud.estado }
    };
  });
};

export const resolverSolicitud = async (solicitudId, { estado, motivo }) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id: solicitudId },
    include: { usuario: true, artesano: true }
  });

  if (!solicitud) {
    const error = new Error("Solicitud no encontrada.");
    error.status = 404;
    throw error;
  }

  if (solicitud.estado !== "PENDIENTE") {
    const error = new Error("La solicitud ya fue resuelta.");
    error.status = 409;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    const solicitudActualizada = await tx.solicitud.update({
      where: { id: solicitudId },
      data: {
        estado,
        motivo: motivo || solicitud.motivo
      }
    });

    if (estado === "APROBADA") {
      await tx.usuario.update({
        where: { id: solicitud.usuarioId },
        data: { rol: "ARTESANO" }
      });

      if (solicitud.artesanoId) {
        await tx.artesano.update({
          where: { id: solicitud.artesanoId },
          data: { estado: "APROBADO" }
        });
      }
    } else if (estado === "RECHAZADA") {
      if (solicitud.artesanoId) {
        await tx.artesano.update({
          where: { id: solicitud.artesanoId },
          data: { estado: "RECHAZADO" }
        });
      }
    }

    return solicitudActualizada;
  });
};

export const listarSolicitudes = async () => {
  return await prisma.solicitud.findMany({
    include: {
      usuario: { select: { id: true, nombre: true, email: true, rol: true } },
      artesano: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const crearAdministrador = async (dto) => {
  const { nombre, email, password } = dto;
  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    const error = new Error("Ya existe un usuario con ese email.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

  return await prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash,
      rol: "ADMINISTRADOR",
      activo: true
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true
    }
  });
};

export const cambiarEstadoCuenta = async (usuarioId, activo) => {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  if (usuario.rol === "ADMINISTRADOR" && activo === false) {
    const adminsActivos = await prisma.usuario.count({
      where: { rol: "ADMINISTRADOR", activo: true }
    });
    if (adminsActivos <= 1) {
      const error = new Error("No se puede desactivar al único administrador activo.");
      error.status = 409;
      throw error;
    }
  }

  return await prisma.usuario.update({
    where: { id: usuarioId },
    data: { activo },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      updatedAt: true
    }
  });
};

export const listarUsuarios = async () => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      ultimoAcceso: true,
      artesano: {
        select: { id: true, estado: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};