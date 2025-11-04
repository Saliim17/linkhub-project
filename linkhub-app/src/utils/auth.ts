export function validateToken(token: string | null) {
  if (!token) return false;
  return token !== 'token-expirado';
}
