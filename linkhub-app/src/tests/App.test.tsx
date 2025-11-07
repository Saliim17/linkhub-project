import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';
import { render, screen } from './test-utils';

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
        // Usamos nuestro render personalizado, que ya incluye MemoryRouter y ThemeProvider
        render(<App />, { wrapperProps: { initialEntries: ['/login'] } });
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('renders register page at /register route', () => {
        render(<App />, { wrapperProps: { initialEntries: ['/register'] } });
        expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    test('renders dashboard page at /dashboard route', () => {
        render(<App />, { wrapperProps: { initialEntries: ['/dashboard'] } });
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    test('redirects root path to dashboard', () => {
        render(<App />, { wrapperProps: { initialEntries: ['/'] } });
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
});