import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RegisterPage } from './RegisterPage';
import { MemoryRouter } from 'react-router-dom';

describe('RegisterPage', () => {
  
  it('should render the form with all required fields and link to login', () => {
    // ARRANGE: Wrap the component in MemoryRouter for navigation context
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // ASSERT: Check for all elements
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    
    // Check all three inputs
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument(); // <-- The new field
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check the button
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

    // Check the link to the login page
    expect(screen.getByRole('link', { name: /login here/i })).toBeInTheDocument();
  });

});