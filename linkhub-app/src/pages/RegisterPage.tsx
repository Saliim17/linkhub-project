import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import AuthForm from '../components/AuthForm';
import AuthFooter from '../components/AuthFooter';
import { API_URL } from '../config';
import Button from '../components/Button';

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
    <AuthForm title="Create Account" footer={<AuthFooter question="Already have an account?" linkText="Login here" linkTo="/login" />}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          label="Email:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          id="username"
          label="Username:"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <Input
          id="password"
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && (
          <p className="text-sm text-center text-error-light dark:text-error-dark">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-md font-bold transition-colors duration-200 disabled:bg-gray-500"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
    </AuthForm>
  );
}
