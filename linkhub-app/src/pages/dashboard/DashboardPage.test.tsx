import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DashboardPage from './DashboardPage';

// 🧩 Mock de axios
vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

// 🧩 Mock de localStorage
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

// 🧩 Simulamos variable de entorno de Vite
Object.defineProperty(import.meta, 'env', {
  value: { VITE_API_URL: 'test' },
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
    localStorage.setItem('linkhub_token', 'FAKE_JWT_TOKEN');
  });

  it('should display "Loading" and then render links when API call is successful', async () => {
    const mockData: LinkItem[] = [
      { id: '1', title: 'Test Link 1', url: 'https://test1.com', createdAt: '2025-10-01' },
      { id: '2', title: 'Test Link 2', url: 'https://test2.com', createdAt: '2025-10-01' },
    ];

    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: mockData });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Debe mostrar el estado "Loading"
    expect(screen.getByText(/loading links/i)).toBeInTheDocument();

    // Esperar a que se rendericen los links
    await waitFor(() => {
      expect(screen.getByText(/test link 1/i)).toBeInTheDocument();
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Verifica número de links
    expect(screen.getByText(/dashboard/i)).toHaveTextContent('(2 Links)');
  });

  it('should display "No links found" when API returns an empty array', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Estado inicial
    expect(screen.getByText(/loading links/i)).toBeInTheDocument();

    // Espera al texto final
    await waitFor(() => {
      expect(screen.getByText(/no links found/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/no links found/i)).toBeInTheDocument();
  });
});
