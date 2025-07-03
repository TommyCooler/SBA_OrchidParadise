import api from './api';

const AccountService = {
  // Register new account
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        accountName: userData.accountName,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        accountName: credentials.accountName,
        password: credentials.password
      });
      
      // Store token if provided
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        
        // Store user info if needed
        const userInfo = {
          accountName: credentials.accountName,
          token: response.data.token
        };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Invalid credentials');
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
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

export default AccountService;
