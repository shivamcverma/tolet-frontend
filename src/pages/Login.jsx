import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { fetchAPI } from '../api';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAPI('/accounts/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data && data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // Fetch profile to get role
        const profileData = await fetchAPI('/accounts/profile/');
        if (profileData && profileData.role) {
          localStorage.setItem('user_role', profileData.role);
        }
        
        navigate('/');
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-10 px-4 md:px-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]">
      <div className="glass-card w-full max-w-[450px] p-8 md:p-12 animate-[fadeIn_0.6s_ease-out]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary">
            <LogIn size={24} />
          </div>
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold font-outfit mb-2 text-text-main">Welcome Back</h2>
          <p className="text-text-muted">Login to your ToLet account</p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl mb-8 text-sm text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              name="username" 
              className="form-input" 
              required 
              value={credentials.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              required 
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-10 text-center text-[0.95rem] text-text-muted">
          <p>Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
