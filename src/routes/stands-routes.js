import { Router } from 'express';
import { getStands, createStand, updateStand, deleteStand } from '../controllers/stands-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { standSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getStands);
router.post('/', validateSchema(standSchema), createStand);
router.put('/:id', validateSchema(standSchema.partial()), updateStand);
router.delete('/:id', deleteStand);

export default router;