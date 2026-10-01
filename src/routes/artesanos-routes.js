import { Router } from 'express';
import { getArtesanos, createArtesano, updateArtesano, deleteArtesano } from '../controllers/artesanos-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { artesanoSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getArtesanos);
router.post('/', validateSchema(artesanoSchema), createArtesano);
router.put('/:id', validateSchema(artesanoSchema.partial()), updateArtesano);
router.delete('/:id', deleteArtesano);

export default router;