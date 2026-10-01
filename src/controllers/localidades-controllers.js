import * as localidadService from '../services/localidades-services.js';

export const getLocalidades = async (req, res) => {
  try {
    const localidades = await localidadService.getAllLocalidades();
    res.json(localidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener localidades" });
  }
};

export const createLocalidad = async (req, res) => {
  try {
    const newLocalidad = await localidadService.createLocalidad(req.body);
    res.status(201).json(newLocalidad);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la localidad" });
  }
};

export const updateLocalidad = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedLocalidad = await localidadService.updateLocalidad(id, req.body);
    res.json(updatedLocalidad);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la localidad o no existe" });
  }
};

export const deleteLocalidad = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await localidadService.deleteLocalidad(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la localidad o no existe" });
  }
};