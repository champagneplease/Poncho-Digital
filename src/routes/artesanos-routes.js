import { Router } from 'express';
import {
  getArtesanos,
  getArtesanoById,
  createArtesano,
  updateArtesano,
  deleteArtesano
} from '../controllers/artesanos-controllers.js';
import { validarArtesano } from '../middlewares/artesano-validator.js';

const router = Router();

// Endpoints CRUD para /api/artesanos
router.get('/', getArtesanos);
router.get('/:id', getArtesanoById);
router.post('/', validarArtesano, createArtesano);
router.put('/:id', updateArtesano);
router.delete('/:id', deleteArtesano);

export default router;