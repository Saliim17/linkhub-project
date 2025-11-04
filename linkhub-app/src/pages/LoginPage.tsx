import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-500">Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Input for Email */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Input for Password */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Display error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'} {/* Show loading feedback */}
        </button>
      </form>
    </div>
  );
}
