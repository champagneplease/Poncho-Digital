import { Router } from 'express';
import { getStands, createStand, updateStand, deleteStand } from '../controllers/stands-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { standSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getStands);
router.post('/', validateSchema(standSchema), createStand);
// Usamos .partial() para que Zod permita actualizar solo algunos campos sin requerir todos
router.put('/:id', validateSchema(standSchema.partial()), updateStand);
router.delete('/:id', deleteStand);

export default router;