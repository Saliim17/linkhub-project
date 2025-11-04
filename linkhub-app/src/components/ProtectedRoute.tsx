import { Navigate } from 'react-router-dom';
import { validateToken } from '../utils/auth'; // Ajusta la ruta según tu proyecto

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('linkhub_token');

  // Si no hay token o el token no es válido
  if (!token || !validateToken(token)) {
    return <Navigate to="/login" replace />;
  }

  // Si el token es válido, renderizamos los hijos
  return <>{children}</>;
}
