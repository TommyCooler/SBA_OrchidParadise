import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccountService } from '../services';
import { getUserRoleFromToken, getUserNameFromToken, isUser, isAdmin } from '../utils/jwtUtils';

// Tạo Auth Context
const AuthContext = createContext({
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  isUser: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  updateAuthState: () => {}
});

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isUserRole, setIsUserRole] = useState(false);
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = AccountService.getToken();
      const user = AccountService.getCurrentUser();
      
      setIsAuthenticated(!!token);
      setCurrentUser(user);
      
      if (token) {
        const role = getUserRoleFromToken(token);
        console.log("role: ", role);
        const userName = getUserNameFromToken(token);
        
        setUserRole(role);
        setIsUserRole(isUser(token));
        setIsAdminRole(isAdmin(token));
        
        // Update user info with role if needed
        if (user && !user.role && role) {
          const updatedUser = { ...user, role, userName };
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      } else {
        setUserRole(null);
        setIsUserRole(false);
        setIsAdminRole(false);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'currentUser') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const result = await AccountService.login(credentials);
      
      setIsAuthenticated(true);
      
      const token = AccountService.getToken();
      const user = AccountService.getCurrentUser();
      let role = null;
      let userName = null;
      
      if (token) {
        role = getUserRoleFromToken(token);
        userName = getUserNameFromToken(token);
        
        setUserRole(role);
        setIsUserRole(isUser(token));
        setIsAdminRole(isAdmin(token));
        
        // Update user info with role
        const updatedUser = { ...user, role, userName };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      return {
        ...result,
        role: role,
      };
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserRole(null);
      setIsUserRole(false);
      setIsAdminRole(false);
      throw error;
    }
  };

  const logout = () => {
    AccountService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    setIsUserRole(false);
    setIsAdminRole(false);
  };

  const updateAuthState = () => {
    const token = AccountService.getToken();
    const user = AccountService.getCurrentUser();
    
    setIsAuthenticated(!!token);
    
    if (token) {
      const role = getUserRoleFromToken(token);
      const userName = getUserNameFromToken(token);
      
      setUserRole(role);
      setIsUserRole(isUser(token));
      setIsAdminRole(isAdmin(token));
      
      // Update user info with role
      const updatedUser = { ...user, role, userName };
      setCurrentUser(updatedUser);
    } else {
      setCurrentUser(null);
      setUserRole(null);
      setIsUserRole(false);
      setIsAdminRole(false);
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    userRole,
    isUser: isUserRole,
    isAdmin: isAdminRole,
    isLoading,
    login,
    logout,
    updateAuthState
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
