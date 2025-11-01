import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginPage } from './LoginPage';

// 'describe' agrupa tests relacionados
describe('LoginPage', () => {
  // 'it' (o 'test') es el test individual
  it('should render the login form elements correctly', () => {
    // 1. ARRANGE (Preparar): Renderizamos el componente
    render(<LoginPage />);

    // 2. ASSERT (Afirmar): Hacemos nuestras comprobaciones

    // Comprueba que el título "Login" está en el documento
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    // Comprueba que el campo de email está
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Comprueba que el campo de contraseña está
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Comprueba que el botón de "Login" está
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
