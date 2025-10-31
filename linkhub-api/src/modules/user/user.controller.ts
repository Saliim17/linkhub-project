import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, createUserSchema } from './user.schema';
import { createUser } from './user.service';
import { Prisma } from '@prisma/client';
import { LoginInput, loginSchema } from './user.schema';
import { login } from './user.service';
import {
  PublicProfileParamsInput,
  publicProfileParamsSchema,
} from './user.schema';
import { getPublicProfile } from './user.service';

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  try {
    const body = createUserSchema.parse(request.body);
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 es el código para "violación de restricción única"
      if (e.code === 'P2002') {
        return reply
          .code(409)
          .send({ message: 'Email or username already exists' });
      }
    }

    // 4. Si es otro tipo de error, enviamos un 500
    console.error(e); // Es bueno loguear el error real en el servidor
    return reply.code(500).send({ message: 'Internal server error' });
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  try {
    // 1. Validar el body
    const body = loginSchema.parse(request.body);

    // 2. Llamar al servicio de login
    const token = await login(body);

    // 3. Enviar el token como respuesta
    return reply.code(200).send({ token });
  } catch (e) {
    console.error(e);
    // 1. Primero verificamos si 'e' es una instancia de Error
    if (e instanceof Error) {
      // 2. Si lo es, ahora TypeScript sabe que 'e' tiene .message
      return reply.code(401).send({ message: e.message });
    }
    // 3. Si no es un Error, enviamos un mensaje genérico
    return reply.code(401).send({ message: 'Invalid email or password' });
  }
}

export async function getPublicProfileHandler(
  request: FastifyRequest<{ Params: PublicProfileParamsInput }>,
  reply: FastifyReply
) {
  try {
    // 1. Validar los parámetros de la URL
    const params = publicProfileParamsSchema.parse(request.params);

    // 2. Llamar al servicio
    const profile = await getPublicProfile(params.username);

    // 3. Devolver el perfil público
    return reply.code(200).send(profile);
  } catch (e) {
    console.error(e);
    // Usamos un 'instanceof' como hicimos en el login
    if (e instanceof Error && e.message === 'User not found') {
      return reply.code(404).send({ message: 'User not found' });
    }
    return reply.code(500).send({ message: 'Internal server error' });
  }
}
