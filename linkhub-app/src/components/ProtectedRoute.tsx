import { Navigate } from 'react-router-dom';

// This component takes other components as "children"
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check for the token in localStorage
  const token = localStorage.getItem('linkhub_token');

  // 1. If the token does NOT exist...
  if (!token) {
    // ...redirect the user to the /login page
    return <Navigate to="/login" replace />;
  }

  // 2. If the token EXISTS...
  // ...show the child component they were trying to access
  return <>{children}</>;
}