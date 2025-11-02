// Importamos los matchers de jest-dom. Esto hace que funcione
// el .toBeInTheDocument() en todos nuestros tests.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(import.meta, 'env', {
  value: { VITE_API_URL: 'test' },
});

vi.stubEnv('VITE_API_URL', 'test');