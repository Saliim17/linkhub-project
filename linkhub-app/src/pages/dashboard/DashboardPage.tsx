import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  // Handle the logout logic
  const handleLogout = () => {
    // 1. Clear the token from storage
    localStorage.removeItem('linkhub_token');
    
    // 2. Redirect the user back to the login page
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! You are logged in.</p>
      
      {/* We will add the API call to fetch links here later */}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}