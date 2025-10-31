import { prisma } from '../../db';
import { CreateLinkInput } from './link.schema';
import { UpdateLinkInput } from './link.schema';

// Servicio para crear un link
export async function createLink(input: CreateLinkInput, userId: string) {
  const link = await prisma.link.create({
    data: {
      title: input.title,
      url: input.url,
      userId: userId, // ¡Lo asociamos al usuario!
    },
  });
  return link;
}

// Servicio para obtener los links de UN usuario
export async function getLinks(userId: string) {
  const links = await prisma.link.findMany({
    where: {
      userId: userId,
    },
  });
  return links;
}

export async function updateLink(
  linkId: string,
  userId: string,
  input: UpdateLinkInput
) {
  // Usamos 'updateMany' con un 'where' compuesto para máxima seguridad.
  // Esto asegura que un usuario SOLO pueda actualizar un link
  // si el 'linkId' Y el 'userId' coinciden.
  const { count } = await prisma.link.updateMany({
    where: {
      id: linkId,
      userId: userId, // ¡El chequeo de seguridad!
    },
    data: {
      title: input.title,
      url: input.url,
    },
  });

  // updateMany devuelve un 'count' de filas afectadas.
  // Si es 0, significa que el link no se encontró O no pertenecía al usuario.
  return count;
}

export async function deleteLink(linkId: string, userId: string) {
  // Misma lógica de seguridad que en update
  const { count } = await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId: userId, // ¡El chequeo de seguridad!
    },
  });

  return count;
}
