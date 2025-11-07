import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();
  
  // El color del borde cambia según el tema actual
  const borderColor = 'border-primary'

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-full p-2 transition-colors duration-200 hover:bg-card-hover border-2 ${borderColor}`}
      aria-label="Alternar tema"
    >
      {actualTheme === 'light' ? (
        <Moon className="h-6 w-6 text-primary" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-500" />
      )}
    </button>
  );
}
