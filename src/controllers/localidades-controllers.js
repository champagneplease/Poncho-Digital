import * as localidadService from '../services/localidades-services.js';

export const getLocalidades = async (req, res, next) => {
  try {
    const localidades = await localidadService.getAllLocalidades();
    res.json(localidades);
  } catch (error) {
    next(error);
  }
};

export const createLocalidad = async (req, res, next) => {
  try {
    const newLocalidad = await localidadService.createLocalidad(req.body);
    res.status(201).json(newLocalidad);
  } catch (error) {
    next(error);
  }
};

export const updateLocalidad = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de la localidad debe ser numérico." });
    }
    const updatedLocalidad = await localidadService.updateLocalidad(id, req.body);
    res.json(updatedLocalidad);
  } catch (error) {
    next(error);
  }
};

export const deleteLocalidad = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID de la localidad debe ser numérico." });
    }
    await localidadService.deleteLocalidad(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};