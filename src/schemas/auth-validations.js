import { z } from "zod";

export const registrarUsuarioSchema = z.object({
  nombre: z.string().trim().min(2, "Debe tener al menos 2 caracteres."),
  email: z.string().email("El email no tiene un formato válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.")
}).strict();

export const registrarArtesanoSchema = registrarUsuarioSchema;

export const iniciarSesionSchema = z.object({
  email: z.string().email("El email no tiene un formato válido."),
  password: z.string().min(1, "La contraseña es obligatoria.")
});

export const postulacionSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  apellido: z.string().trim().optional(),
  email: z.string().email("El email no tiene un formato válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  telefono: z.string().optional(),
  localidadId: z.number().int().positive().optional(),
  motivo: z.string().optional()
}).strict();

export const crearAdminSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("El email no tiene un formato válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.")
}).strict();

export const cambiarEstadoCuentaSchema = z.object({
  activo: z.boolean({ required_error: "El campo activo es obligatorio y debe ser booleano." })
}).strict();

export const resolverSolicitudSchema = z.object({
  estado: z.enum(["APROBADA", "RECHAZADA"], {
    errorMap: () => ({ message: "El estado debe ser APROBADA o RECHAZADA." })
  }),
  motivo: z.string().optional()
}).strict();