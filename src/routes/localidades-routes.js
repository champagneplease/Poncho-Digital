import { Router } from 'express';
import { getLocalidades, createLocalidad, updateLocalidad, deleteLocalidad } from '../controllers/localidades-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { localidadSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getLocalidades);
router.post('/', validateSchema(localidadSchema), createLocalidad);
router.put('/:id', validateSchema(localidadSchema.partial()), updateLocalidad);
router.delete('/:id', deleteLocalidad);

export default router;