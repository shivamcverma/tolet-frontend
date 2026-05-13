import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Menu, X } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-[16px] border-b border-black/5 h-[80px] md:h-[70px] flex items-center transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-4 w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold font-outfit text-text-main" onClick={closeMenu}>
          <Home className="text-primary drop-shadow-[0_2px_8px_rgba(139,92,246,0.25)]" size={32} />
          <span>ToLet</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="md:hidden text-text-main z-[1001] flex items-center justify-center" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navbar Links */}
        <div className={`fixed inset-y-0 right-0 w-[280px] bg-bg-surface flex flex-col justify-center p-8 gap-8 z-[999] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-black/5 md:static md:w-auto md:h-auto md:bg-transparent md:flex-row md:p-0 md:gap-10 md:shadow-none md:border-none transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <Link to="/properties" className="text-xl md:text-[0.95rem] font-medium text-text-muted hover:text-primary transition-colors duration-300 text-center relative group" onClick={closeMenu}>
            Listings
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          {token ? (
            <>
              {userRole === 'PROPERTY_OWNER' && (
                <Link to="/dashboard" className="text-xl md:text-[0.95rem] font-medium text-text-muted hover:text-primary transition-colors duration-300 text-center relative group" onClick={closeMenu}>
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary w-full md:w-auto px-5 py-2.5 text-sm">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xl md:text-[0.95rem] font-medium text-text-muted hover:text-primary transition-colors duration-300 text-center relative group" onClick={closeMenu}>
                Login
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/register" className="btn btn-primary w-full md:w-auto px-5 py-2.5 text-sm" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-[4px] z-[998] animate-[fadeIn_0.3s_ease-out]" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;
