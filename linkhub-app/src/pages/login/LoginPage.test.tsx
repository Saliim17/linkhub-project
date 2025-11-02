import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoginPage } from './LoginPage';
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage', () => {
  
  it('should render the login form elements correctly', () => {
    //Wrap the component with Memory Router
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    //ASSERT (Affirm): We perform our checks
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

});