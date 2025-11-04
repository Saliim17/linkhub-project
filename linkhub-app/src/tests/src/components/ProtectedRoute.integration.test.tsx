import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

// Mock pages
const MockLoginPage = () => <div>Página de Login</div>;
const MockDashboardPage = () => <div>Panel de Control Secreto</div>;

// Mock de validación de token (simula expiración)
const isTokenValid = (token: string | null) => token !== 'token-expirado';

// Opcional: si tu ProtectedRoute usará validateToken desde utils/auth
vi.mock('../../../utils/auth', () => ({
validateToken: (token: string | null) => isTokenValid(token),
}));

describe('ProtectedRoute Integration', () => {
beforeEach(() => {
localStorage.clear();
});

it('redirects to /login if no token is found', () => {
render(
<MemoryRouter initialEntries={['/dashboard-secreto']}> <Routes>
<Route path="/login" element={<MockLoginPage />} />
<Route
path="/dashboard-secreto"
element={ <ProtectedRoute> <MockDashboardPage /> </ProtectedRoute>
}
/> </Routes> </MemoryRouter>
);


expect(screen.getByText(/Página de Login/i)).toBeInTheDocument();
expect(screen.queryByText(/Panel de Control Secreto/i)).not.toBeInTheDocument();


});

it('renders the child component if a valid token is found', () => {
localStorage.setItem('linkhub_token', 'token-valido');


render(
  <MemoryRouter initialEntries={['/dashboard-secreto']}>
    <Routes>
      <Route path="/login" element={<MockLoginPage />} />
      <Route
        path="/dashboard-secreto"
        element={
          <ProtectedRoute>
            <MockDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </MemoryRouter>
);

expect(screen.getByText(/Panel de Control Secreto/i)).toBeInTheDocument();
expect(screen.queryByText(/Página de Login/i)).not.toBeInTheDocument();


});

it('redirects to /login if token is expired', () => {
localStorage.setItem('linkhub_token', 'token-expirado');


render(
  <MemoryRouter initialEntries={['/dashboard-secreto']}>
    <Routes>
      <Route path="/login" element={<MockLoginPage />} />
      <Route
        path="/dashboard-secreto"
        element={
          <ProtectedRoute>
            <MockDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </MemoryRouter>
);

expect(screen.getByText(/Página de Login/i)).toBeInTheDocument();
expect(screen.queryByText(/Panel de Control Secreto/i)).not.toBeInTheDocument();


});
});
