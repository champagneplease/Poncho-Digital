import jwt from "jsonwebtoken";
import { verificarToken } from "../services/tokens-services.js";
import { tokenEstaRevocado } from "../services/revocaciones-services.js";
import { prisma } from "../config/db.js";

export { validateSchema, validarEsquema } from "./zod-validator.js";

const responderAuth = (res, status, authHeader, mensaje) => {
  res.set("WWW-Authenticate", authHeader);
  return res.status(status).json({ mensaje });
};

export const autenticarUsuario = async (req, res, next) => {
  const encabezado = req.get("Authorization");
  if (!encabezado) {
    return responderAuth(res, 401, "Bearer", "Se requiere un token de acceso.");
  }

  const [, token] = /^Bearer +(\S+)$/i.exec(encabezado) || [];
  if (!token) {
    return responderAuth(res, 400, 'Bearer error="invalid_request"', "Usar Authorization: Bearer <token>.");
  }

  try {
    const payload = verificarToken(token);
    const revocado = await tokenEstaRevocado(payload.jti);
    if (revocado) throw new jwt.JsonWebTokenError("Token revocado.");

    req.usuario = payload;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof SyntaxError) {
      return responderAuth(res, 401, 'Bearer error="invalid_token"', "Token inválido, vencido o revocado.");
    }
    return next(error);
  }
};

export const autenticarArtesano = autenticarUsuario;

export const cargarContextoCuenta = async (req, res, next) => {
  try {
    const id = req.usuario?.id;
    if (!id) {
      return res.status(401).json({ mensaje: "No hay sesión autenticada." });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { artesano: true }
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: "La cuenta ya no existe." });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: "Cuenta desactivada. Acceso prohibido." });
    }

    req.contextoUsuario = usuario;
    req.usuario = {
      ...req.usuario,
      ...usuario,
      artesanoId: usuario.artesano?.id || null
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const autorizarRoles = (...rolesPermitidos) => (req, res, next) => {
  const rol = req.contextoUsuario?.rol || req.usuario?.rol;
  if (!rolesPermitidos.includes(rol)) {
    return res.status(403).json({
      mensaje: `Acceso prohibido. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}.`
    });
  }
  next();
};