import { Router } from 'express';
import { getUbicaciones, createUbicacion, updateUbicacion, deleteUbicacion } from '../controllers/ubicaciones-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { ubicacionSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getUbicaciones);
router.post('/', validateSchema(ubicacionSchema), createUbicacion);
router.put('/:id', validateSchema(ubicacionSchema.partial()), updateUbicacion);
router.delete('/:id', deleteUbicacion);

export default router;