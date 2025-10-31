import fastify from 'fastify';
import {
  registerUserHandler,
  loginHandler,
  getPublicProfileHandler,
} from './modules/user/user.controller';
import { authHook } from './modules/user/user.auth';
import {
  createLinkHandler,
  getLinksHandler,
  updateLinkHandler,
  deleteLinkHandler,
} from './modules/link/link.controller';

// --- AUMENTACIÓN DE TIPOS ---
// Le decimos a TypeScript que el objeto Request de Fastify
// ahora puede tener una propiedad 'user'
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      username: string;
    };
  }
}
// --- FIN DE AUMENTACIÓN ---

const app = fastify({
  logger: true,
});

// --- RUTAS ---
// Rutas públicas (login/register)
app.get('/health', async (_request, _reply) => {
  return { status: 'ok' };
});
app.post('/auth/register', registerUserHandler);
app.post('/auth/login', loginHandler);
app.get('/:username', getPublicProfileHandler);

// Rutas protegidas (requieren token)
app.register(async function (protectedRoutes) {
  // 1. Añadimos el guardián.
  // ¡Este 'hook' se ejecutará en TODAS las rutas
  // registradas dentro de esta función!
  protectedRoutes.addHook('onRequest', authHook);

  // 2. Definimos las rutas protegidas
  protectedRoutes.post('/links', createLinkHandler);
  protectedRoutes.get('/links', getLinksHandler);
  protectedRoutes.put('/links/:id', updateLinkHandler);
  protectedRoutes.delete('/links/:id', deleteLinkHandler);
});

// --- FIN DE RUTAS ---

// --- INICIO ---
const main = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

main();
