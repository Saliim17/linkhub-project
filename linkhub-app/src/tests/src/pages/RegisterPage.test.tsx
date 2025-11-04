import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { RegisterPage } from '../../../pages/RegisterPage';

// 🔧 Mock axios (simulate the API)
vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

// 🔧 Mock window.alert
window.alert = vi.fn();

// 🔧 Componente simulado al que se navega después del registro
const MockLogin = () => <div>Welcome to Login Page</div>;

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all form elements correctly', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('should register successfully and redirect to login page', async () => {
    // 🔧 Simula respuesta exitosa del API
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: '123', username: 'newuser' },
    });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<MockLogin />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'new@user.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'newuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    // Espera que la navegación ocurra
    await waitFor(() => {
      expect(screen.getByText(/welcome to login page/i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      { email: 'new@user.com', username: 'newuser', password: 'password123' }
    );

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Registration successful for user: newuser')
    );
  });

  it('should show error message when registration fails', async () => {
    const errorMsg = 'Email already exists';

    // 🔧 Forzar el type guard y simular respuesta de error
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMsg } },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // ACT: Simula al usuario escribiendo y haciendo clic
    await userEvent.type(screen.getByLabelText(/email/i), 'duplicate@user.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'takenuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Comprueba que el mensaje de error (el correcto) aparece
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  // Test 4: Simulación de un ERROR DE RED
  it('should display network error message when API call fails unexpectedly', async () => {
    // ARRANGE: Simula un error genérico (isAxiosError será 'false')
    // Le damos dos mocks para cubrir el StrictMode
    const errorMsg = 'Network error: Could not connect to the API.';
    const genericError = new Error('Network failed');
    mockedAxios.post
      .mockRejectedValueOnce(genericError)
      .mockRejectedValueOnce(genericError);

    // Asegurarse de que isAxiosError devuelva false (simulando un error no-Axios)
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // ACT: Simula al usuario escribiendo y haciendo clic
    await userEvent.type(screen.getByLabelText(/email/i), 'network@error.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'usernetwork');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Espera a que aparezca el mensaje de error de RED
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  it('should display fallback error message when API returns empty message', async () => {
    const fallbackErrorMsg = 'Registration failed.';
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: {} },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'no-msg@user.com');
    await userEvent.type(screen.getByLabelText(/username/i), 'nomsguser');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(fallbackErrorMsg)).toBeInTheDocument();
    });
  });
});
