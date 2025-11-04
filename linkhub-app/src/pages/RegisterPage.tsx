import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // <-- Importar Link y useNavigate
import { API_URL } from '../config';

interface RegisterResponse {
  id: string; // The API returns the user object on successful registration
  username: string;
}
interface ErrorResponse {
  message: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- TU LÓGICA (SIN CAMBIOS) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Call the API (POST /auth/register)
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/auth/register`,
        { email, username, password }
      );

      // 2. Success: Alert user and redirect to login
      alert(
        `Registration successful for user: ${response.data.username}. Please log in.`
      );
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data as ErrorResponse;
        setError(errorData.message || 'Registration failed.');
      } else {
        setError('Network error: Could not connect to the API.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- BLOQUE 'RETURN' ACTUALIZADO CON TAILWIND ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Campo de Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Username:
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mensaje de Error */}
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {/* Botón de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-blue-600 rounded-md font-bold text-white hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-500"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Link a Login */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
