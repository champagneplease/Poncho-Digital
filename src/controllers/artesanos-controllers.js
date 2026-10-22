import * as artesanoService from '../services/artesanos-services.js';

export const getArtesanos = async (req, res, next) => {
  try {
    const artesanos = await artesanoService.getAllArtesanos();
    res.json(artesanos);
  } catch (error) {
    next(error);
  }
};

export const getArtesanoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artesano = await artesanoService.getArtesanoById(id);
    if (!artesano) {
      return res.status(404).json({ error: "Artesano no encontrado" });
    }
    res.json(artesano);
  } catch (error) {
    next(error);
  }
};

export const createArtesano = async (req, res, next) => {
  try {
    const newArtesano = await artesanoService.createArtesano(req.body);
    res.status(201).json(newArtesano);
  } catch (error) {
    next(error);
  }
};

export const updateArtesano = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedArtesano = await artesanoService.updateArtesano(id, req.body);
    res.json(updatedArtesano);
  } catch (error) {
    next(error);
  }
};

export const deleteArtesano = async (req, res, next) => {
  try {
    const { id } = req.params;
    await artesanoService.deleteArtesano(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateArtesanoEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!["PENDIENTE", "APROBADO", "RECHAZADO"].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido. Debe ser PENDIENTE, APROBADO o RECHAZADO." });
    }
    
    const updatedArtesano = await artesanoService.updateArtesanoEstado(id, estado);
    res.json(updatedArtesano);
  } catch (error) {
    next(error);
  }
};