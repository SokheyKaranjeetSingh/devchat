import axios from 'axios';
import { clearStoredAuth } from '../utils/helpers';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      clearStoredAuth();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API (No auth required)
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Thread API (Authenticated users)
export const threadAPI = {
  getAll: () => api.get('/threads'),
  getById: (id) => api.get(`/threads/${id}`),
  create: (threadData) => api.post('/threads', threadData),
  search: (keyword) => api.get(`/threads/search?keyword=${keyword}`),
  update: (id, threadData) => api.put(`/threads/${id}`, threadData),
  delete: (id) => api.delete(`/threads/${id}`),
};

// Message API (Authenticated users)
export const messageAPI = {
  getByThread: (threadId) => api.get(`/messages/thread/${threadId}`),
  create: (messageData) => api.post('/messages', messageData),
  update: (id, messageData) => api.put(`/messages/${id}`, messageData),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Admin API (Admin/SuperAdmin only)
export const adminAPI = {
  getPendingUsers: () => api.get('/admin/pending-users'),
  verifyUser: (userId) => api.post(`/admin/verify/${userId}`),
  getAllUsers: () => api.get('/admin/users'),
};

// Vote API (Authenticated users)
export const voteAPI = {
  vote: (voteData) => api.post('/votes', voteData),
  getCounts: (messageId) => api.get(`/votes/${messageId}/counts`),
};

// User API (keeping for backward compatibility)
export const userAPI = {
  getAll: () => api.get('/users'),
  getByUsername: (username) => api.get(`/users/${username}`),
};

export default api;