import * as artesanosService from '../services/artesanos-services.js';

export const getArtesanos = async (req, res, next) => {
  try {
    const artesanos = await artesanosService.obtenerArtesanos();
    res.status(200).json(artesanos);
  } catch (error) {
    next(error);
  }
};

export const getArtesanoById = async (req, res, next) => {
  try {
    const artesano = await artesanosService.obtenerArtesanoPorId(req.params.id);
    if (!artesano) {
      return res.status(404).json({ error: "Artesano no encontrado" });
    }
    res.status(200).json(artesano);
  } catch (error) {
    next(error);
  }
};

export const createArtesano = async (req, res, next) => {
  try {
    const nuevoArtesano = await artesanosService.crearArtesano(req.body);
    res.status(201).json(nuevoArtesano);
  } catch (error) {
    if (error.message === 'Ya existe un artesano con este nombre') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const updateArtesano = async (req, res, next) => {
  try {
    const artesanoActualizado = await artesanosService.actualizarArtesano(req.params.id, req.body);
    res.status(200).json(artesanoActualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteArtesano = async (req, res, next) => {
  try {
    await artesanosService.eliminarArtesano(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};