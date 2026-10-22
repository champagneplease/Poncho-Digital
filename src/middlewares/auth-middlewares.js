import jwt from "jsonwebtoken";
import { verificarToken } from "../services/tokens-services.js";
import { tokenEstaRevocado } from "../services/revocaciones-services.js";
import { prisma } from "../config/db.js";

export { validateSchema, validarEsquema } from "./zod-validator.js";

export const autenticarUsuario = async (req, res, next) => {
  const encabezado = req.get("Authorization");
  if (!encabezado) {
    res.set("WWW-Authenticate", "Bearer");
    return res.status(401).json({ mensaje: "Se requiere un token de acceso." });
  }

  const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);
  if (!coincidencia) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_request"');
    return res.status(400).json({ mensaje: "Usar Authorization: Bearer <token>." });
  }

  try {
    const payload = verificarToken(coincidencia[1]);
    if (await tokenEstaRevocado(payload.jti)) {
      throw new jwt.JsonWebTokenError("Token revocado.");
    }
    req.usuario = payload;
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      return next(error);
    }
    res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
    return res.status(401).json({ mensaje: "Token inválido, vencido o revocado." });
  }
  return next();
};

export const autenticarArtesano = autenticarUsuario;

export const cargarContextoCuenta = async (req, res, next) => {
  try {
    if (!req.usuario?.id) {
      return res.status(401).json({ mensaje: "No hay sesión autenticada." });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      include: { artesano: true }
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: "La cuenta ya no existe." });
    }

    if (usuario.activo === false) {
      return res.status(403).json({ mensaje: "Cuenta desactivada. Acceso prohibido." });
    }

    req.contextoUsuario = usuario;
    req.usuario = {
      ...req.usuario,
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      artesanoId: usuario.artesano?.id || null
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const rolActual = req.contextoUsuario?.rol || req.usuario?.rol;
    if (!rolActual || !rolesPermitidos.includes(rolActual)) {
      return res.status(403).json({
        mensaje: `Acceso prohibido. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}.`
      });
    }
    next();
  };
};