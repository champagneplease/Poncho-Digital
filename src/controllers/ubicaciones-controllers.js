import * as ubicacionService from '../services/ubicaciones-services.js';

export const getUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await ubicacionService.getAllUbicaciones();
    res.json(ubicaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ubicaciones" });
  }
};

export const createUbicacion = async (req, res) => {
  try {
    const newUbicacion = await ubicacionService.createUbicacion(req.body);
    res.status(201).json(newUbicacion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la ubicación" });
  }
};

export const updateUbicacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedUbicacion = await ubicacionService.updateUbicacion(id, req.body);
    res.json(updatedUbicacion);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la ubicación o no existe" });
  }
};

export const deleteUbicacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await ubicacionService.deleteUbicacion(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la ubicación o no existe" });
  }
};