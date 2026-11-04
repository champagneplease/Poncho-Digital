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

router.post("/registro", validateSchema(registrarUsuarioSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Registrar un nuevo usuario artesano'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/RegistroInput' }
    }
    #swagger.responses[201] = {
      description: 'Usuario artesano registrado exitosamente',
      schema: { $ref: '#/components/schemas/UsuarioResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos inválidos en el cuerpo de la solicitud',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[409] = {
      description: 'Ya existe un usuario registrado con ese email',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return registrar(req, res, next);
});

router.post("/login", validateSchema(iniciarSesionSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Iniciar sesión y obtener token JWT'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/LoginInput' }
    }
    #swagger.responses[200] = {
      description: 'Credenciales verificadas y token generado exitosamente',
      schema: { $ref: '#/components/schemas/LoginResponse' }
    }
    #swagger.responses[400] = {
      description: 'Formato de datos inválido en la petición',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[401] = {
      description: 'Credenciales incorrectas o cuenta inactiva',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return login(req, res, next);
});

router.post("/postulacion", validateSchema(postulacionSchema), (req, res, next) => {
  /* 
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Registrar postulación pública de artesano'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      schema: { $ref: '#/components/schemas/PostulacionInput' }
    }
    #swagger.responses[201] = {
      description: 'Postulación registrada en estado pendiente',
      schema: { $ref: '#/components/schemas/PostulacionResponse' }
    }
    #swagger.responses[400] = {
      description: 'Datos de postulación incompletos o inválidos',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[409] = {
      description: 'Ya existe una cuenta registrada con ese email',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return postular(req, res, next);
});

router.post("/logout", autenticarUsuario, (req, res, next) => {
  /* 
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Cerrar sesión revocando el token de acceso actual'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[204] = {
      description: 'Sesión cerrada y token revocado con éxito'
    }
    #swagger.responses[400] = {
      description: 'Cabecera Authorization mal formada',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[401] = {
      description: 'No autenticado o token inválido/revocado',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return logout(req, res, next);
});

router.get("/me", autenticarUsuario, (req, res, next) => {
  /* 
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Obtener el perfil de la cuenta autenticada'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Datos del perfil de usuario y artesano asociado si existe',
      schema: { $ref: '#/components/schemas/PerfilMeResponse' }
    }
    #swagger.responses[400] = {
      description: 'Cabecera Authorization mal formada',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
    #swagger.responses[401] = {
      description: 'No autenticado o token inválido/revocado',
      schema: { $ref: '#/components/schemas/ErrorApi' }
    }
  */
  return getPerfilMe(req, res, next);
});

export default router;
