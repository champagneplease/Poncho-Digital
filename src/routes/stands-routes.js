import { Router } from 'express';
import {
  getStands,
  getStandById,
  createStand,
  updateStand,
  deleteStand
} from '../controllers/stands-controllers.js';

const router = Router();

// Endpoints CRUD para /api/stands
router.get('/', getStands);             // Leer todos
router.get('/:id', getStandById);       // Leer uno
router.post('/', createStand);          // Crear
router.put('/:id', updateStand);        // Actualizar
router.delete('/:id', deleteStand);     // Eliminar

export default router;