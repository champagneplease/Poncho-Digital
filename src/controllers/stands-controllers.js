import * as standService from '../services/stands-services.js';

export const getStands = async (req, res, next) => {
  try {
    const result = await standService.getAllStands(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createStand = async (req, res, next) => {
  try {
    const newStand = await standService.createStand(req.body);
    res.status(201).json(newStand);
  } catch (error) {
    next(error);
  }
};

export const updateStand = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID del stand debe ser numérico." });
    }
    const updatedStand = await standService.updateStand(id, req.body);
    res.json(updatedStand);
  } catch (error) {
    next(error);
  }
};

export const deleteStand = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensaje: "El ID del stand debe ser numérico." });
    }
    await standService.deleteStand(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};