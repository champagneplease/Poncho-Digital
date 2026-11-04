import { z } from 'zod';

export const localidadSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre de la localidad es obligatorio"),
  provincia: z.string().trim().optional()
}).strict();

export const ubicacionSchema = z.object({
  pabellon: z.string().trim().min(1, "El pabellón es obligatorio"),
  sector: z.string().trim().min(1, "El sector es obligatorio")
}).strict();

export const artesanoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre es obligatorio"),
  apellido: z.string().trim().min(2, "El apellido es obligatorio"),
  telefono: z.string().trim().optional(),
  localidadId: z.number().int().positive("Debe incluir un ID de localidad válido").optional()
}).strict();

export const actualizarEstadoArtesanoSchema = z.object({
  estado: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"], {
    errorMap: () => ({ message: "El estado debe ser PENDIENTE, APROBADO o RECHAZADO." })
  })
}).strict();

export const productoSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre del producto es obligatorio"),
  precio: z.number().positive("El precio debe ser mayor a 0")
}).strict();

export const standSchema = z.object({
  coordenadas: z.string().trim().optional(),
  ubicacionId: z.number().int().positive("Debe incluir un ID de ubicación válido"),
  artesanoId: z.union([z.string().uuid(), z.number().int().positive()]).nullable().optional()
}).strict();
