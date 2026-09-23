import * as standsService from '../services/stands-services.js';

export const getStands = async (req, res, next) => {
  try {
    const stands = await standsService.obtenerStands();
    res.status(200).json(stands);
  } catch (error) {
    next(error);
  }
};

export const getStandById = async (req, res, next) => {
  try {
    const stand = await standsService.obtenerStandPorId(req.params.id);
    if (!stand) {
      return res.status(404).json({ error: "Stand no encontrado" });
    }
    res.status(200).json(stand);
  } catch (error) {
    next(error);
  }
};

export const createStand = async (req, res, next) => {
  try {
    const nuevoStand = await standsService.crearStand(req.body);
    res.status(201).json(nuevoStand);
  } catch (error) {
    next(error);
  }
};

export const updateStand = async (req, res, next) => {
  try {
    const standActualizado = await standsService.actualizarStand(req.params.id, req.body);
    res.status(200).json(standActualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteStand = async (req, res, next) => {
  try {
    await standsService.eliminarStand(req.params.id);
    res.status(204).send(); // 204 significa "No Content", éxito al eliminar
  } catch (error) {
    next(error);
  }
};