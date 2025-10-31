import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateLinkInput, createLinkSchema } from './link.schema';
import { createLink, getLinks } from './link.service';
import {
  LinkParamsInput,
  linkParamsSchema,
  UpdateLinkInput,
  updateLinkSchema,
} from './link.schema';
import { updateLink, deleteLink } from './link.service';

// Handler para crear un link
export async function createLinkHandler(
  request: FastifyRequest<{ Body: CreateLinkInput }>,
  reply: FastifyReply
) {
  try {
    // ¡Nuestro guardián ya puso 'request.user' aquí!
    const user = request.user;

    // Si por alguna razón 'user' no está, es un error 500
    if (!user) {
      return reply.code(500).send({ message: 'User not found in request' });
    }

    const body = createLinkSchema.parse(request.body);
    const link = await createLink(body, user.id);

    return reply.code(201).send(link);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

// Handler para obtener los links del usuario
export async function getLinksHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = request.user;
    if (!user) {
      return reply.code(500).send({ message: 'User not found in request' });
    }

    const links = await getLinks(user.id);
    return reply.code(200).send(links);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function updateLinkHandler(
  request: FastifyRequest<{ Body: UpdateLinkInput; Params: LinkParamsInput }>,
  reply: FastifyReply
) {
  try {
    const user = request.user;
    if (!user) {
      return reply.code(500).send({ message: 'User not found in request' });
    }

    // Validamos el body Y los params de la URL
    const body = updateLinkSchema.parse(request.body);
    const params = linkParamsSchema.parse(request.params);

    const count = await updateLink(params.id, user.id, body);

    if (count === 0) {
      return reply
        .code(404)
        .send({ message: 'Link not found or user unauthorized' });
    }
    return reply.code(200).send({ message: 'Link updated' });
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function deleteLinkHandler(
  request: FastifyRequest<{ Params: LinkParamsInput }>,
  reply: FastifyReply
) {
  try {
    const user = request.user;
    if (!user) {
      return reply.code(500).send({ message: 'User not found in request' });
    }

    const params = linkParamsSchema.parse(request.params);

    const count = await deleteLink(params.id, user.id);

    if (count === 0) {
      return reply
        .code(404)
        .send({ message: 'Link not found or user unauthorized' });
    }
    // 204 = "No Content", la respuesta estándar para un DELETE exitoso
    return reply.code(204);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}
