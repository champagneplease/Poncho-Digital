import { Router } from "express";
import {
  registrar,
  login,
  logout,
  getPerfilMe,
  postular
} from "../controllers/auth-controllers.js";
import {
  autenticarUsuario,
  validateSchema
} from "../middlewares/auth-middlewares.js";
import {
  registrarUsuarioSchema,
  iniciarSesionSchema,
  postulacionSchema
} from "../schemas/auth-validations.js";

const router = Router();

// Rutas públicas
router.post("/registro", validateSchema(registrarUsuarioSchema), registrar);
router.post("/login", validateSchema(iniciarSesionSchema), login);
router.post("/postulacion", validateSchema(postulacionSchema), postular);

// Rutas protegidas por JWT
router.post("/logout", autenticarUsuario, logout);
router.get("/me", autenticarUsuario, getPerfilMe);

export default router;