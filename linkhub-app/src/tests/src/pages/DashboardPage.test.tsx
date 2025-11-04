import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DashboardPage from '../../../pages/DashboardPage';

// 🧩 Mock axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

// 🧩 Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 🧩 Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 🧩 Simula variable de entorno (modo normal)
Object.defineProperty(import.meta, 'env', {
  value: { VITE_API_URL: 'http://fake-api' },
});

interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders links when API call is successful', async () => {
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');
    const mockData: LinkItem[] = [
      { id: '1', title: 'Link A', url: 'https://a.com', createdAt: '2025-10-01' },
      { id: '2', title: 'Link B', url: 'https://b.com', createdAt: '2025-10-02' },
    ];
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: mockData });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading links/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/link a/i)).toBeInTheDocument();
      expect(screen.getByText(/dashboard/i)).toHaveTextContent('(2 Links)');
    });
  });

  it('shows "No links found" when API returns empty array', async () => {
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no links found/i)).toBeInTheDocument();
    });
  });

  it('redirects to login when no token is found', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles 401 error by removing token, showing message, and redirecting to login', async () => {
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');

    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);
    const axiosError = { response: { status: 401 } };
    mockedAxios.get = vi.fn().mockRejectedValueOnce(axiosError);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem('linkhub_token')).toBeNull();
      expect(screen.getByText(/your session expired/i)).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles generic error by showing fallback error message', async () => {
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');
    mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load links/i)).toBeInTheDocument();
    });
  });

  it('logs out and navigates to /login when clicking Logout button', async () => {
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no links found/i)).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('linkhub_token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
