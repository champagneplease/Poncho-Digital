import { Router } from "express";
import { registrar, login, logout } from "../controllers/auth-controllers.js";
import { validarEsquema, autenticarArtesano } from "../middlewares/auth-middlewares.js";
import { registrarArtesanoSchema, iniciarSesionSchema } from "../schemas/auth-validations.js";

const router = Router();

router.post("/registro", validarEsquema(registrarArtesanoSchema), registrar);
router.post("/login", validarEsquema(iniciarSesionSchema), login);
router.post("/logout", autenticarArtesano, logout);

export default router;