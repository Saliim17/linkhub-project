import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { LoginPage } from '../../../pages/LoginPage';

// ✅ Mock axios (simular la API)
vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

// ✅ Mock del componente Dashboard
const MockDashboard = () => <div>Has llegado al Dashboard</div>;

// ✅ Mock de la función 'alert'
window.alert = vi.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should render the login form elements correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  // ✅ LOGIN EXITOSO
  it('should call api, save token, and redirect on successful login', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({ data: { token: 'eyj...fake.token' } })
      .mockResolvedValueOnce({ data: { token: 'eyj...fake.token' } });

    const storageSpy = vi.spyOn(window.Storage.prototype, 'setItem');

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<MockDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'test@user.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Has llegado al Dashboard/i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      { email: 'test@user.com', password: 'password123' }
    );

    expect(storageSpy).toHaveBeenCalledWith(
      'linkhub_token',
      'eyj...fake.token'
    );
  });

  it('should display an error message on failed login', async () => {
    const errorMsg = 'Invalid email or password';

    // 🔧 Forzamos a axios.isAxiosError() a devolver true siempre durante el test
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    // 🔧 Simulamos el objeto que tendría un error real de axios
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMsg } },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@user.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // Esperamos a que aparezca el mensaje de error en pantalla
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
        <LoginPage />
      </MemoryRouter>
    );

    // ACT: Simula al usuario escribiendo y haciendo clic
    await userEvent.type(screen.getByLabelText(/email/i), 'network@error.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    // ASSERT: Espera a que aparezca el mensaje de error de RED
    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  it('should display fallback error message when API returns empty message', async () => {
    const fallbackErrorMsg = 'Login failed: Unknown API error.';

    // Simular un error de Axios sin mensaje
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: {} },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'user@no-msg.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(fallbackErrorMsg)).toBeInTheDocument();
    });
  });
});
