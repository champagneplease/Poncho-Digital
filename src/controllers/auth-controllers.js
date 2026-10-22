import * as authService from "../services/auth-services.js";
import { generarToken } from "../services/tokens-services.js";
import { revocarToken } from "../services/revocaciones-services.js";

export const registrar = async (req, res, next) => {
  try {
    const usuario = await authService.registrarUsuario(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const usuario = await authService.iniciarSesion(req.body);
    const token = generarToken(usuario);
    
    return res.status(200).json({
      mensaje: "Credenciales verificadas correctamente.",
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        artesanoId: usuario.artesanoId
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await revocarToken(req.usuario);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export const getPerfilMe = async (req, res, next) => {
  try {
    const usuario = await authService.obtenerPerfilMe(req.usuario.id);
    return res.status(200).json(usuario);
  } catch (error) {
    return next(error);
  }
};

export const postular = async (req, res, next) => {
  try {
    const resultado = await authService.postularArtesano(req.body);
    return res.status(201).json({
      mensaje: "Postulación registrada correctamente. Estado pendiente de aprobación.",
      ...resultado
    });
  } catch (error) {
    return next(error);
  }
};

export const resolverSolicitud = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de la solicitud debe ser numérico." });
    }

    const solicitud = await authService.resolverSolicitud(id, req.body);
    return res.status(200).json({
      mensaje: `Solicitud ${solicitud.estado.toLowerCase()} con éxito.`,
      solicitud
    });
  } catch (error) {
    next(error);
  }
};

export const listarSolicitudes = async (req, res, next) => {
  try {
    const solicitudes = await authService.listarSolicitudes();
    return res.status(200).json(solicitudes);
  } catch (error) {
    next(error);
  }
};

export const crearAdmin = async (req, res, next) => {
  try {
    const nuevoAdmin = await authService.crearAdministrador(req.body);
    return res.status(201).json(nuevoAdmin);
  } catch (error) {
    next(error);
  }
};

export const cambiarEstadoCuenta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    const usuarioActualizado = await authService.cambiarEstadoCuenta(id, activo);
    return res.status(200).json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await authService.listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};