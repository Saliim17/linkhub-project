import fastify from 'fastify';
import cors from '@fastify/cors';
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

// --- TYPES AUGMENTATION ---
// Tells TypeScript that the Fastify Request object now has a 'user' property
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      username: string;
    };
  }
}
// --- END TYPES AUGMENTATION ---

const app = fastify({
  logger: true,
});

// --- REGISTER CORS PLUGIN (FIXES NETWORK ERROR) ---
// This allows the frontend (port 5173) to communicate with the API (port 3000)
app.register(cors, {
  origin: true, // Allows all origins (safe for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary HTTP methods
});
// --------------------------------------------------


// --- ROUTES ---
// Public routes (login/register)
app.get('/health', async (_request, _reply) => {
  return { status: 'ok' };
});
app.post('/auth/register', registerUserHandler);
app.post('/auth/login', loginHandler);
app.get('/:username', getPublicProfileHandler);

// Protected routes (require token)
app.register(async function (protectedRoutes) {
  // 1. Add the authentication hook: runs before every route in this group
  protectedRoutes.addHook('onRequest', authHook);

  // 2. Define the protected routes
  protectedRoutes.post('/links', createLinkHandler);
  protectedRoutes.get('/links', getLinksHandler);
  protectedRoutes.put('/links/:id', updateLinkHandler);
  protectedRoutes.delete('/links/:id', deleteLinkHandler);
});

// --- END ROUTES ---

// --- BOOTSTRAP ---
const main = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

main();