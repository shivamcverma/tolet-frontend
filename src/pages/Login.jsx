import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { fetchAPI } from '../api';
import './Login.css';

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
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <LogIn size={24} className="auth-icon" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to your ToLet account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              name="username" 
              className="form-input" 
              required 
              value={credentials.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              required 
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="text-primary">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
