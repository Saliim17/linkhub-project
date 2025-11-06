import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 transition-colors duration-200 hover:bg-card-hover"
      aria-label="Alternar tema"
    >
      {actualTheme === 'light' ? (
        <Sun className="h-6 w-6 text-primary" />
      ) : (
        <Moon className="h-6 w-6 text-primary" />
      )}
    </button>
  );
}
