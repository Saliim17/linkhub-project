import { z } from 'zod';

// Esquema para crear un link
export const createLinkSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  url: z.url({ message: 'La URL no es válida' }),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

// Esquema para actualizar un link (idéntico al de creación)
export const updateLinkSchema = createLinkSchema;
export type UpdateLinkInput = CreateLinkInput;

// Esquema para los parámetros de la URL (ej. /links/:id)
export const linkParamsSchema = z.object({
  id: z.cuid({ message: 'El ID no es un CUID válido' }),
});
export type LinkParamsInput = z.infer<typeof linkParamsSchema>;
