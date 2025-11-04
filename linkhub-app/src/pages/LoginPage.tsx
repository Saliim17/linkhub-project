import { useState } from 'react';
import axios from 'axios';
// 1. AÑADIMOS 'Link' PARA EL ENLACE A 'REGISTRO'
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

// Define the type for a successful response (the JWT token)
interface LoginResponse {
  token: string;
}

// Define the type for the error coming from our API (e.g., 'Invalid email or password')
interface ErrorResponse {
  message: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To disable the button while loading

  // --- TU LÓGICA (SIN CAMBIOS) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Call the API (POST /auth/login)
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        { email, password }
      );

      // 2. Success: Save the token in localStorage (the standard)
      const token = response.data.token;
      localStorage.setItem('linkhub_token', token);

      //console.log('Login successful. Token saved:', token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      // 3. Error handling: Use the Axios type guard
      if (axios.isAxiosError(err) && err.response) {
        // Error 401 response is typically in the form { message: string }
        const errorData = err.response.data as ErrorResponse;
        setError(errorData.message || 'Login failed: Unknown API error.');
      } else {
        // Handle network errors or code errors (e.g., server down)
        setError('Network error: Could not connect to the API.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 2. EL BLOQUE 'RETURN' ACTUALIZADO CON TAILWIND ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Login
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Link a Registro */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
