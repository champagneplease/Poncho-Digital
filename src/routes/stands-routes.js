import { Router } from 'express';
import { getStands, createStand, updateStand, deleteStand } from '../controllers/stands-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { requireApiKey } from '../middlewares/auth-validator.js';
import { standSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getStands);
// Protected endpoints
router.post('/', requireApiKey, validateSchema(standSchema), createStand);
// Usamos .partial() para que Zod permita actualizar solo algunos campos sin requerir todos
router.put('/:id', requireApiKey, validateSchema(standSchema.partial()), updateStand);
router.delete('/:id', requireApiKey, deleteStand);

export default router;