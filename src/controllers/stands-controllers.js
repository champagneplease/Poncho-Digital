import * as standService from '../services/stands-services.js';

export const getStands = async (req, res) => {
  try {
    const result = await standService.getAllStands(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los stands" });
  }
};

export const createStand = async (req, res) => {
  try {
    const newStand = await standService.createStand(req.body);
    res.status(201).json(newStand);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el stand" });
  }
};

export const updateStand = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedStand = await standService.updateStand(id, req.body);
    res.json(updatedStand);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el stand o no existe" });
  }
};

export const deleteStand = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await standService.deleteStand(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el stand o no existe" });
  }
};