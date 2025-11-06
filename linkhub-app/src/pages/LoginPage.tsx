import { useState } from 'react';
import axios from 'axios';
// 1. AÑADIMOS 'Link' PARA EL ENLACE A 'REGISTRO'
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import AuthForm from '../components/AuthForm';
import AuthFooter from '../components/AuthFooter';
import { API_URL } from '../config';
import Button from '../components/Button';

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

  return (
    <AuthForm title="Login" footer={<AuthFooter question="Don't have an account?" linkText="Register here" linkTo="/register" />}>
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
          id="password"
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-center text-error-light dark:text-error-dark">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded-md font-bold transition-colors duration-200 disabled:bg-gray-500"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </AuthForm>
  );
}
