import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { fetchAPI } from '../api';
import './Login.css'; // Reuse Login CSS for auth styling

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    phone_number: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchAPI('/accounts/register/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Auto login after registration
      const loginData = await fetchAPI('/accounts/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (loginData && loginData.access) {
        localStorage.setItem('access_token', loginData.access);
        localStorage.setItem('refresh_token', loginData.refresh);
        localStorage.setItem('user_role', formData.role);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="auth-icon-container">
            <UserPlus size={24} className="auth-icon" />
          </div>
          <h2>Create an Account</h2>
          <p>Join ToLet to find or list properties</p>
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
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              name="phone_number" 
              className="form-input" 
              value={formData.phone_number}
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
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select 
              name="role" 
              className="form-input" 
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Student / Tenant</option>
              <option value="PROPERTY_OWNER">Property Owner</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
