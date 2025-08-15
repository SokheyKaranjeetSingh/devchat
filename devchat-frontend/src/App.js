import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ThreadList from './components/Threads/ThreadsList';
import ThreadDetail from './components/Threads/ThreadDetail';
import CreateThread from './components/Threads/CreateThread';
import AdminDashboard from './components/Admin/AdminDashboard';
import ToastProvider from './components/Notifications/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './components/ErrorBoundary/ErrorBoundary.css';
import './styles/App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};

const UserRoute = ({ children }) => {
  const { isAuthenticated, isUser, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isUser) return <Navigate to="/dashboard" />;
  
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/threads" 
                element={
                  <ProtectedRoute>
                    <ThreadList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/thread/:id" 
                element={
                  <ProtectedRoute>
                    <ThreadDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-thread" 
                element={
                  <UserRoute>
                    <CreateThread />
                  </UserRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            <ToastProvider />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
};

export default App;