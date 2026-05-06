import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // We can store this during 

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Home className="logo-icon" />
          <span>ToLet</span>
        </Link>
        <div className="navbar-links">
          <Link to="/properties" className="nav-link">Listings</Link>
          {token ? (
            <>
              {userRole === 'PROPERTY_OWNER' && (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary nav-btn">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
