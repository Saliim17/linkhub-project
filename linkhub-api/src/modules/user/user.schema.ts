import { z } from 'zod';

// Esquema para validar la creación de un usuario
export const createUserSchema = z.object({
  email: z.email({ message: 'El email no es válido o está vacío' }),
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),

  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Inferimos un tipo de TypeScript a partir del esquema de Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;

// Esquema para validar el login
export const loginSchema = z.object({
  email: z.email({ message: 'El email no es válido o está vacío' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

// Inferimos el tipo de TypeScript
export type LoginInput = z.infer<typeof loginSchema>;

export const publicProfileParamsSchema = z.object({
  username: z.string(),
});
export type PublicProfileParamsInput = z.infer<
  typeof publicProfileParamsSchema
>;
