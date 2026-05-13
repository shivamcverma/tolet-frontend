import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { fetchAPI } from '../api';

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
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-10 px-4 md:px-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]">
      <div className="glass-card w-full max-w-[500px] p-8 md:p-12 animate-[fadeIn_0.6s_ease-out]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 text-primary">
            <UserPlus size={24} />
          </div>
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold font-outfit mb-2 text-text-main">Create an Account</h2>
          <p className="text-text-muted">Join ToLet to find or list properties</p>
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
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">Phone Number</label>
            <input 
              type="text" 
              name="phone_number" 
              className="form-input" 
              value={formData.phone_number}
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
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[0.9rem] font-semibold mb-2 text-text-muted uppercase tracking-wider">I am a...</label>
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
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center text-[0.95rem] text-text-muted">
          <p>Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
