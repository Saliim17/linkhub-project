import { hash } from 'bcryptjs';
import { prisma } from '../../db';
import { CreateUserInput } from './user.schema';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginInput } from './user.schema';

export async function createUser(input: CreateUserInput) {
  // Hasheamos la contraseña
  // El "10" es el "salt" o rondas de hasheo
  const hashedPassword = await hash(input.password, 10);

  // Creamos el usuario en la BD
  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      password: hashedPassword,
    },
  });

  return user;
}

export async function login(input: LoginInput) {
  // 1. Encontrar al usuario por email
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Si no existe, lanzamos un error
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Comparar la contraseña del input con la de la BD
  const passwordMatch = await compare(input.password, user.password);

  // Si no coinciden, lanzamos un error
  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Generar un JWT (Token)
  // Guardaremos el ID y el email del usuario en el token
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  // Firmamos el token con un "secreto".
  // ¡¡NUNCA pongas esto aquí en producción!! Debería ir en tu .env
  const token = jwt.sign(payload, 'tu-secreto-super-secreto', {
    expiresIn: '7d', // El token expira en 7 días
  });

  // 4. Devolver el token
  return token;
}

export async function getPublicProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    // ¡La magia está aquí!
    include: {
      links: {
        // Incluye todos los links relacionados
        orderBy: {
          createdAt: 'asc', // Opcional: ordénalos
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // No queremos exponer la contraseña hasheada al público
  // Creamos un objeto de perfil seguro para devolver
  const { password: _password, ...safeProfile } = user;

  return safeProfile;
}
