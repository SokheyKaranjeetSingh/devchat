import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
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
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './DashboardModern.css';

const Dashboard = () => {
  const { user, isUser, isDev, isAdmin } = useAuth();

  const getRoleWelcomeMessage = () => {
    if (isUser) return "Welcome! You can create help requests and view discussions.";
    if (isDev) return "Welcome! You can help users by replying to their threads.";
    if (isAdmin) return "Welcome! You have admin access to manage users and oversee discussions.";
    return "Welcome to DevChat!";
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (isUser) {
      actions.push(
        { 
          title: "Create Help Request", 
          description: "Post a new thread asking for help", 
          link: "/create-thread",
          icon: Plus,
          color: "primary"
        },
        { 
          title: "Browse Discussions", 
          description: "View all ongoing discussions", 
          link: "/threads",
          icon: MessageSquare,
          color: "secondary"
        }
      );
    }
    
    if (isDev) {
      actions.push(
        { 
          title: "Help Users", 
          description: "Reply to user questions and help requests", 
          link: "/threads",
          icon: Users,
          color: "primary"
        },
        { 
          title: "Browse Discussions", 
          description: "View all ongoing discussions", 
          link: "/threads",
          icon: MessageSquare,
          color: "secondary"
        }
      );
    }
    
    if (isAdmin) {
      actions.push(
        { 
          title: "Admin Dashboard", 
          description: "Manage users and verify accounts", 
          link: "/admin",
          icon: Shield,
          color: "primary"
        },
        { 
          title: "View All Discussions", 
          description: "Oversee all platform discussions", 
          link: "/threads",
          icon: Activity,
          color: "secondary"
        }
      );
    }
    
    return actions;
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="welcome-text">
              <h1 className="welcome-title">
                Welcome back, {user?.username}!
              </h1>
              <p className="welcome-subtitle">{getRoleWelcomeMessage()}</p>
              <div className="user-badges">
                <span className={`user-badge role-${user?.role?.toLowerCase()}`}>
                  <Shield size={14} />
                  {user?.role}
                </span>
                {user?.verified && (
                  <span className="user-badge verified">
                    <CheckCircle size={14} />
                    Verified Developer
                  </span>
                )}
                <span className="user-badge member-since">
                  <Clock size={14} />
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="quick-actions-section">
          <div className="section-header">
            <h2 className="section-title">
              <Activity size={24} />
              Quick Actions
            </h2>
            <p className="section-subtitle">Get started with these common tasks</p>
          </div>
          <div className="actions-grid">
            {getQuickActions().map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} to={action.link} className={`action-card ${action.color}`}>
                  <div className="action-header">
                    <div className="action-icon">
                      <IconComponent size={24} />
                    </div>
                    <ArrowRight className="action-arrow" size={18} />
                  </div>
                  <div className="action-content">
                    <h3 className="action-title">{action.title}</h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="stats-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendingUp size={24} />
              Platform Overview
            </h2>
            <p className="section-subtitle">Your activity and platform statistics</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card highlight">
              <div className="stat-icon">
                <Shield size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{user?.role}</h3>
                <p className="stat-label">Your Role</p>
              </div>
              <div className="stat-trend positive">
                <TrendingUp size={16} />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                {user?.verified ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="stat-content">
                <h3 className={`stat-value ${user?.verified ? 'verified' : 'pending'}`}>
                  {user?.verified ? 'Verified' : 'Pending'}
                </h3>
                <p className="stat-label">Account Status</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">12</h3>
                <p className="stat-label">Active Threads</p>
              </div>
              <div className="stat-trend positive">
                <TrendingUp size={16} />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">1.2k</h3>
                <p className="stat-label">Community Members</p>
              </div>
              <div className="stat-trend positive">
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
