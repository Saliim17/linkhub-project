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
      alert(`Registration successful for user: ${response.data.username}. Please log in.`);
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

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (inputs) ... */}
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link> {/* <-- Link to login */}
      </p>
    </div>
  );
}