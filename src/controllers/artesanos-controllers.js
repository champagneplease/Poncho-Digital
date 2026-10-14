import * as artesanoService from '../services/artesanos-services.js';

export const getArtesanos = async (req, res) => {
  try {
    const artesanos = await artesanoService.getAllArtesanos();
    res.json(artesanos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artesanos" });
  }
};
export const getArtesanoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artesano = await artesanosService.getArtesanoById(id);
    res.json(artesano);
  } catch (error) {
    next(error);
  }
};

export const createArtesano = async (req, res) => {
  try {
    const newArtesano = await artesanoService.createArtesano(req.body);
    res.status(201).json(newArtesano);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el artesano" });
  }
};

export const updateArtesano = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedArtesano = await artesanoService.updateArtesano(id, req.body);
    res.json(updatedArtesano);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el artesano o no existe" });
  }
};

export const deleteArtesano = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await artesanoService.deleteArtesano(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el artesano o no existe" });
  }
};