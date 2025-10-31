import { PrismaClient } from '@prisma/client';

// Creamos una instancia global del cliente de Prisma
export const prisma = new PrismaClient({
  // Opcional: Esto registrará todas las consultas que Prisma haga
  log: ['query', 'info', 'warn', 'error'],
});
