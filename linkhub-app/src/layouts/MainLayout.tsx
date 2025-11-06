import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export function MainLayout() {
  return (
    <div className="relative min-h-screen bg-background text-text transition-colors duration-300">
      {/* Botón flotante arriba a la derecha */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Aquí se renderizan las rutas hijas */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
