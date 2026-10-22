import * as ubicacionService from '../services/ubicaciones-services.js';

export const getUbicaciones = async (req, res, next) => {
  try {
    const ubicaciones = await ubicacionService.getAllUbicaciones();
    res.json(ubicaciones);
  } catch (error) {
    next(error);
  }
};

export const createUbicacion = async (req, res, next) => {
  try {
    const newUbicacion = await ubicacionService.createUbicacion(req.body);
    res.status(201).json(newUbicacion);
  } catch (error) {
    next(error);
  }
};

export const updateUbicacion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de la ubicación debe ser numérico." });
    }
    const updatedUbicacion = await ubicacionService.updateUbicacion(id, req.body);
    res.json(updatedUbicacion);
  } catch (error) {
    next(error);
  }
};

export const deleteUbicacion = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de la ubicación debe ser numérico." });
    }
    await ubicacionService.deleteUbicacion(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};