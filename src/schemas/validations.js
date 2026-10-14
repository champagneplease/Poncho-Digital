import { z } from 'zod';

export const localidadSchema = z.object({
  nombre: z.string().min(2, "El nombre de la localidad es obligatorio"),
  provincia: z.string().optional()
});

export const ubicacionSchema = z.object({
  pabellon: z.string().min(1, "El pabellón es obligatorio"),
  sector: z.string().min(1, "El sector es obligatorio")
});

export const artesanoSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellido: z.string().min(2, "El apellido es obligatorio"),
  telefono: z.string().optional(),
  localidadId: z.number().int().positive("Debe incluir un ID de localidad válido")
});

export const productoSchema = z.object({
  nombre: z.string().min(2, "El nombre del producto es obligatorio"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  artesanoId: z.number().int().positive().optional("Debe pertenecer a un artesano válido")
});

export const standSchema = z.object({
  estado: z.string().optional(),
  ubicacionId: z.number().int().positive("Debe incluir un ID de ubicación válido"),
  artesanoId: z.number().int().positive().optional()
});