import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('../../src/pages/LoginPage', () => ({
    LoginPage: () => <div>Login Page</div>
}));

vi.mock('../../src/pages/RegisterPage', () => ({
    RegisterPage: () => <div>Register Page</div>
}));

vi.mock('../../src/pages/DashboardPage', () => ({
    default: () => <div>Dashboard Page</div>
}));

vi.mock('../../src/components/ProtectedRoute', () => ({
    ProtectedRoute: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('App Component', () => {
    test('renders login page at /login route', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('renders register page at /register route', () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    test('renders dashboard page at /dashboard route', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    test('redirects root path to dashboard', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
});