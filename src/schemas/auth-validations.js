import { z } from "zod";

export const registrarArtesanoSchema = z.object({
  nombre: z.string().trim().min(2, "Debe tener al menos 2 caracteres."),
  apellido: z.string().optional(),
  email: z.email("El email no tiene un formato válido."),
  password: z.string().min(8, "Debe tener al menos 8 caracteres.")
});

export const iniciarSesionSchema = z.object({
  email: z.email("El email no tiene un formato válido."),
  password: z.string().min(1, "La contraseña es obligatoria.")
});