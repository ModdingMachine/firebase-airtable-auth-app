import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server. Please check if the server is running.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// API methods
export const checkEmailExists = async (email) => {
  const response = await api.get('/api/check-email', {
    params: { email }
  });
  return response.data;
};

export const bootstrapUser = async () => {
  const response = await api.post('/api/bootstrap');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/api/profile', profileData);
  return response.data;
};

// Admin-only methods
export const searchUsers = async (query) => {
  const response = await api.get('/api/admin/users/search', {
    params: { q: query }
  });
  return response.data;
};

export const updateUserAsAdmin = async (uid, userData) => {
  const response = await api.put(`/api/admin/users/${uid}`, userData);
  return response.data;
};

// Issue reporting methods
export const reportIssue = async (issueData) => {
  const response = await api.post('/api/issues', issueData);
  return response.data;
};

export const getIssues = async (includeResolved = false) => {
  const response = await api.get('/api/issues', {
    params: { includeResolved }
  });
  return response.data;
};

export const resolveIssue = async (issueId) => {
  const response = await api.put(`/api/issues/${issueId}/resolve`);
  return response.data;
};

export default api;

