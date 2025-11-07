/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../context/ThemeProvider';

type WrapperProps = {
  children: React.ReactNode;
  initialEntries?: string[];
};

const AllTheProviders = ({ children, initialEntries }: WrapperProps) => {
  return (
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { wrapperProps?: Omit<WrapperProps, 'children'> }
) => render(ui, { wrapper: (props) => <AllTheProviders {...props} {...options?.wrapperProps} />, ...options });

// Re-exportar todo desde @testing-library/react
export * from '@testing-library/react';

// Sobrescribir el método `render` con nuestra versión personalizada
export { customRender as render };