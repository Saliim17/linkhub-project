import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

// ✅ Usa la variable del entorno o una URL local por defecto
const API_URL = import.meta.env.VITE_API_URL ?? 'http://192.168.1.40:3000';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      console.log('🔍 useEffect ejecutado (DashboardPage)');

      const token = localStorage.getItem('linkhub_token');
      console.log('Token encontrado:', token);

      // ✅ Evita redirecciones en tests (cuando VITE_API_URL === "test")
      if (!token) {
        console.log('🚪 No token -> redirigiendo a /login');
        if (import.meta.env.VITE_API_URL !== 'test') {
          navigate('/login');
        }
        return;
      }

      try {
        setLoading(true);
        console.log('📡 Llamando API...');

        const response = await axios.get<LinkItem[]>(`${API_URL}/links`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('✅ Respuesta recibida:', response.data);
        setLinks(response.data);
      } catch (err) {
        console.error('❌ Error fetching links:', err);

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('linkhub_token');
          setError('Your session expired. Please log in again.');
          if (import.meta.env.VITE_API_URL !== 'test') {
            navigate('/login');
          }
        } else {
          setError('Failed to load links.');
        }
      } finally {
        console.log('🏁 Finalizando carga');
        setLoading(false);
      }
    };

    fetchLinks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('linkhub_token');
    navigate('/login');
  };

  // --- Render states ---
  if (loading) return <h2>Loading links...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard ({links.length} Links)</h1>
      <p>This data was fetched using your protected JWT.</p>

      {links.length > 0 ? (
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <strong>{link.title}</strong>{' '}
              (<a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>)
            </li>
          ))}
        </ul>
      ) : (
        <p>No links found</p>
      )}

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button>
    </div>
  );
}
