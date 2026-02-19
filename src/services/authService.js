import { api } from '@/lib/api';

export const authService = {
  // Login
  login: async (email, password, role) => {
    const data = await api.post('/auth/login', { email, password });
    
    // Store token in localStorage immediately after successful login
    if (data.status === 'success' && data.data.token) {
      localStorage.setItem('token', data.data.token);
    }
    
    return data;
  },

  // Register
  register: async (payload) => {
    return api.post('/auth/register', payload);
  },

  // Get public branches (for registration)
  getPublicBranches: async () => {
    return api.get('/auth/branches');
  },

  // Logout
  logout: () => {
    // Remove both user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const data = await api.post('/auth/refresh-token', { refreshToken });

    // Update token in localStorage if new token is provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  },
};

export default authService;