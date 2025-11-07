import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme, type ThemeContextType } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: Theme;
}

export default function ThemeProvider({
  children,
  storageKey = 'theme',
  defaultTheme = 'light',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = stored || defaultTheme;
    console.log('Initial theme:', initialTheme);
    return initialTheme;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Efecto inicial para establecer el tema cuando el componente se monta
  useEffect(() => {
    console.log('Initial theme effect running');
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]); // Solo se ejecuta una vez al montar
  useEffect(() => {
    const root = document.documentElement;
      const effectiveTheme = theme === 'dark' ? 'dark' : 'light';

      console.log('Theme changing to:', effectiveTheme);
    setActualTheme(effectiveTheme);

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

  const toggleTheme = () => {
    console.log('Current theme before toggle:', theme);
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('New theme:', newTheme);
      return newTheme;
    });
  };

  const value: ThemeContextType = { theme, actualTheme, toggleTheme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
