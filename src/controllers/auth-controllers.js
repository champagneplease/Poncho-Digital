import * as authService from "../services/auth-services.js";
import { generarToken } from "../services/tokens-services.js";
import { revocarToken } from "../services/revocaciones-services.js";

export const registrar = async (req, res, next) => {
  try {
    const artesano = await authService.registrarArtesano(req.dtoValidado);
    return res.status(201).json(artesano);
  } catch (error) {
    console.error(" ERROR REAL EN REGISTRO:", error); // <-- Esto te lo va a mostrar en la consola
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const artesano = await authService.iniciarSesion(req.dtoValidado);
    const token = generarToken(artesano);
    
    return res.status(200).json({
      mensaje: "Credenciales verificadas correctamente.",
      token: token,
      usuario: artesano
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await revocarToken(req.artesano);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};