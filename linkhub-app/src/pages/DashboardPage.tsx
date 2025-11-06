import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/Card';
import { API_URL } from '../config';
import Button from '../components/Button';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

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

      // 🚪 Si no hay token, redirige siempre a /login
      if (!token) {
        console.log('🚪 No token -> redirigiendo a /login');
        navigate('/login');
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
          navigate('/login');
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
  if (loading) return <h2 className="text-text p-4">Loading links...</h2>;
  if (error) return <h2 className="text-error p-4">Error: {error}</h2>;

  return (
    <div className="p-5 bg-background text-text min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard ({links.length} Links)</h1>
            <p className="text-sm text-text">This data was fetched using your protected JWT.</p>
          </div>

          <Button onClick={handleLogout} className="rounded p-2">
            Logout
          </Button>
        </div>

        <div className="mt-6">
          {links.length > 0 ? (
            <ul className="space-y-3">
              {links.map((link) => (
                <Card as="li" key={link.id} className="p-4">
                    <strong className="block text-text">{link.title}</strong>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                      {link.url}
                    </a>
                </Card>
              ))}
            </ul>
          ) : (
            <p className="text-text">No links found</p>
          )}
        </div>
      </div>
    </div>
  );
}
