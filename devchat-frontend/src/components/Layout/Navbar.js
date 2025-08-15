import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isDev, isUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          DevChat
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-item">
            Dashboard
          </Link>
          
          <Link to="/threads" className="navbar-item">
            Threads
          </Link>
          
          {isUser && (
            <Link to="/create-thread" className="navbar-item">
              Create Thread
            </Link>
          )}
          
          {(isAdmin) && (
            <Link to="/admin" className="navbar-item">
              Admin
            </Link>
          )}
          
          <div className="navbar-user">
            <span className={`user-role ${user?.role?.toLowerCase()}`}>
              {user?.username} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
