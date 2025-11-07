/** @type {import('tailwindcss').Config} */
export default {
  // Habilitamos el modo oscuro basado en una clase en el elemento <html>.
  // Esto es crucial para que funcione con tu `theme.css`.
  darkMode: 'class',

  // Rutas a los archivos donde Tailwind buscará las clases que usas.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // Aquí mapeamos tus variables CSS a nombres de colores de Tailwind.
      // Ahora puedes usar clases como `bg-background`, `text-primary`, etc.
      colors: {
        'background': 'var(--color-background)',
        'text': 'var(--color-text)',
        'primary': 'var(--color-primary)',
        'border': 'var(--color-border)',
        'error': 'var(--color-error)',
        'success': 'var(--color-success)',

        'button': 'var(--color-button)',
        'hover-button': 'var(--color-hover-button)',
        'text-button': 'var(--color-text-button)',

        'card-bg': 'var(--color-card-bg)',
        'card-hover': 'var(--color-card-hover)',

        'input-bg': 'var(--color-input-bg)',
        'input-text': 'var(--color-input-text)',
        'input-border': 'var(--color-input-border)',
        'input-focus': 'var(--color-input-focus)',
      },
    },
  },

  plugins: [],
};