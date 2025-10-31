import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

// Este es el "secreto" que usamos para firmar el token
// ¡¡Debe ser el MISMO que usaste en user.service.ts!!
const JWT_SECRET = 'tu-secreto-super-secreto';

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  try {
    // 1. Obtener el token del header 'Authorization'
    // El formato es "Bearer <token>"
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.code(401).send({ message: 'Malformed token' });
    }

    // 2. Verificar el token
    // Esto decodifica el payload (id, email, username)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. ¡IMPORTANTE! Adjuntar el usuario al objeto 'request'
    // Ahora, todas las rutas que vengan DESPUÉS de este hook
    // tendrán acceso a 'request.user'
    request.user = decoded as { id: string; email: string; username: string };
  } catch (e) {
    console.error(e);
    return reply.code(401).send({ message: 'Invalid token' });
  }
}
