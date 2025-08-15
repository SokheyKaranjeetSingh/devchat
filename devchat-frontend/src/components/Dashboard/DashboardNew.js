import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Star,
  Plus,
  ArrowRight,
  Clock,
  Shield,
  Code2,
  Activity
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isUser, isDev, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalThreads: 42,
    totalUsers: 128,
    verifiedDevs: 24,
    activeToday: 18
  });

  const getRoleInfo = () => {
    if (isAdmin) return {
      title: "Admin Dashboard",
      description: "Manage users, verify developers, and oversee discussions",
      badge: "Admin",
      badgeClass: "admin"
    };
    if (isDev) return {
      title: "Developer Hub",
      description: "Help fellow developers and share your expertise",
      badge: "Verified Developer",
      badgeClass: "developer"
    };
    if (isUser) return {
      title: "Discussion Hub",
      description: "Ask questions, learn, and connect with developers",
      badge: "Member",
      badgeClass: "user"
    };
    return {
      title: "Welcome to DevChat",
      description: "Join the developer community",
      badge: "Guest",
      badgeClass: "guest"
    };
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (isUser) {
      actions.push(
        { 
          title: "Ask a Question", 
          description: "Get help from the community", 
          link: "/create-thread",
          icon: Plus,
          color: "primary"
        },
        { 
          title: "Browse Discussions", 
          description: "Explore ongoing conversations", 
          link: "/threads",
          icon: MessageSquare,
          color: "secondary"
        }
      );
    }
    
    if (isDev) {
      actions.push(
        { 
          title: "Help Others", 
          description: "Answer questions and share knowledge", 
          link: "/threads",
          icon: Star,
          color: "success"
        },
        { 
          title: "Create Thread", 
          description: "Start a new discussion", 
          link: "/create-thread",
          icon: Plus,
          color: "primary"
        }
      );
    }
    
    if (isAdmin) {
      actions.push(
        { 
          title: "Admin Panel", 
          description: "Manage users and platform settings", 
          link: "/admin",
          icon: Shield,
          color: "warning"
        },
        { 
          title: "View Activity", 
          description: "Monitor platform discussions", 
          link: "/threads",
          icon: Activity,
          color: "info"
        }
      );
    }
    
    return actions;
  };

  const roleInfo = getRoleInfo();
  const quickActions = getQuickActions();

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="welcome-text">
              <h1 className="welcome-title">
                Welcome back, {user?.username || 'Developer'}!
              </h1>
              <p className="welcome-subtitle">{roleInfo.description}</p>
              <div className="user-badges">
                <span className={`user-badge ${roleInfo.badgeClass}`}>
                  {roleInfo.badge}
                </span>
                {user?.verified && (
                  <span className="verified-badge">
                    <Star size={12} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalThreads}</div>
              <div className="stat-label">Total Threads</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Community Members</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.verifiedDevs}</div>
              <div className="stat-label">Verified Developers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon info">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.activeToday}</div>
              <div className="stat-label">Active Today</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className={`action-card ${action.color}`}
                onClick={() => navigate(action.link)}
              >
                <div className="action-icon">
                  <action.icon size={24} />
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-card">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <MessageSquare size={16} />
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>JavaScript Performance Question</strong> was created
                  </div>
                  <div className="activity-time">
                    <Clock size={12} />
                    2 hours ago
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">
                  <Star size={16} />
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>React Hooks Best Practices</strong> received a verified answer
                  </div>
                  <div className="activity-time">
                    <Clock size={12} />
                    4 hours ago
                  </div>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">
                  <Users size={16} />
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>3 new developers</strong> joined the community
                  </div>
                  <div className="activity-time">
                    <Clock size={12} />
                    6 hours ago
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/threads')}
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
