import { Router } from 'express';
import { getArtesanos, getArtesanoById, createArtesano, updateArtesano, updateArtesanoEstado, deleteArtesano } from '../controllers/artesanos-controllers.js';
import { validateSchema } from '../middlewares/zod-validator.js';
import { requireApiKey } from '../middlewares/auth-validator.js';
import { artesanoSchema } from '../schemas/validations.js';

const router = Router();

router.get('/', getArtesanos);
router.get('/:id', getArtesanoById);
// Protected endpoints
router.post('/', requireApiKey, validateSchema(artesanoSchema), createArtesano);
router.put('/:id', requireApiKey, validateSchema(artesanoSchema.partial()), updateArtesano);
router.patch('/:id/estado', requireApiKey, updateArtesanoEstado);
router.delete('/:id', requireApiKey, deleteArtesano);

export default router;
