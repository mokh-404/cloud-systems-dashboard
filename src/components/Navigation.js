import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import '../styles/Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      description: 'Overview & metrics'
    },
    {
      path: '/servers',
      label: 'Servers',
      description: 'Manage infrastructure'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/servers' && location.pathname.startsWith('/servers'));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      apiService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const currentUser = apiService.getCurrentUser();

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="nav-container">
        <div className="nav-content">
          {/* Logo and Brand */}
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link" onClick={closeMenu}>
              <div className="brand-logo">CS</div>
              <span className="brand-text">Cloud Systems</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-link-label">{item.label}</span>
                <span className="nav-link-desc">{item.description}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="nav-user">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser?.name || 'User'}</span>
                <span className="user-role">{currentUser?.role || 'Admin'}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn btn-secondary logout-btn"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing Out...
                </>
              ) : (
                'Sign Out'
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="mobile-nav-label">{item.label}</span>
                <span className="mobile-nav-desc">{item.description}</span>
              </Link>
            ))}
            
            <div className="mobile-nav-divider"></div>
            
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="user-avatar large">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="mobile-user-details">
                  <span className="user-name">{currentUser?.name || 'User'}</span>
                  <span className="user-email">{currentUser?.email || 'user@example.com'}</span>
                  <span className="user-role">{currentUser?.role || 'Admin'}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn btn-secondary mobile-logout-btn"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing Out...
                  </>
                ) : (
                  'Sign Out'
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Navigation;
