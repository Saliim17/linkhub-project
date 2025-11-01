import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // <-- BLOQUE A AÑADIR
    globals: true,
    environment: 'jsdom', // Simula un entorno de navegador
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
