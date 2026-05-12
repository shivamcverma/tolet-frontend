import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Home className="logo-icon" />
          <span>ToLet</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navbar Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/properties" className="nav-link" onClick={closeMenu}>Listings</Link>
          {token ? (
            <>
              {userRole === 'PROPERTY_OWNER' && (
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary nav-btn">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};


export default Navbar;
