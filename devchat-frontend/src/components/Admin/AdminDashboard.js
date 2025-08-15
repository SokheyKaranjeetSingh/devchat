import React, { useState, useEffect } from 'react';
import { adminAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, usersResponse] = await Promise.all([
        adminAPI.getPendingUsers(),
        user?.role === 'SUPERADMIN' ? adminAPI.getAllUsers() : userAPI.getAll()
      ]);
      
      setPendingUsers(pendingResponse.data);
      setAllUsers(usersResponse.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      toast.success('User verified successfully!');
      
      // Remove from pending users and add to all users
      const verifiedUser = pendingUsers.find(user => user.id === userId);
      if (verifiedUser) {
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        setAllUsers(prev => [...prev, { ...verifiedUser, verified: true }]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify user');
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="error">Access denied. Admin privileges required.</div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading admin dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users and oversee platform activities</p>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Users ({pendingUsers.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Users ({allUsers.length})
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="tab-content">
            <h2>Pending User Verifications</h2>
            {pendingUsers.length === 0 ? (
              <div className="no-data">No pending users to verify</div>
            ) : (
              <div className="users-grid">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="user-card pending">
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p>{user.email}</p>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="user-actions">
                      <button 
                        onClick={() => handleVerifyUser(user.id)}
                        className="verify-btn"
                      >
                        Verify User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="tab-content">
            <h2>All Users</h2>
            <div className="users-grid">
              {allUsers.map((user) => (
                <div key={user.id} className={`user-card ${user.verified ? 'verified' : 'unverified'}`}>
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                    <span className={`status-badge ${user.verified ? 'verified' : 'pending'}`}>
                      {user.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="user-meta">
                    <small>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
