import api from './api';

const AccountService = {
  // Register new account
  register: async (userData) => {
    try {
      const response = await api.post('/accounts/register', null, {
        params: {
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/accounts/login', null, {
        params: {
          email: credentials.email,
          password: credentials.password
        }
      });
      
      // Store token if provided
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user from local storage
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
};

export default AccountService;
