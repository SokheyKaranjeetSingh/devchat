import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Shield, 
  Settings, 
  Plus,
  LogOut,
  Code2
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/threads', icon: MessageSquare, label: 'Threads' },
    { to: '/create-thread', icon: Plus, label: 'New Thread' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Code2 size={28} />
          <span className="logo-text">DevChat</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.to} className="nav-item">
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="username">{user?.username}</div>
            <div className="user-role">
              {user?.verified && <span className="verified-badge">Verified Dev</span>}
              {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
