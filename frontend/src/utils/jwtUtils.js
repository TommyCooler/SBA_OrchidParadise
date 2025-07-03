// jwtUtils.js - Utility functions for JWT token handling
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserRoleFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload?.role || null;
};

export const getUserNameFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload?.sub || null; // 'sub' is the standard JWT claim for subject (username)
};

export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

export const hasRole = (token, requiredRole) => {
  const userRole = getUserRoleFromToken(token);
  return userRole === requiredRole;
};

export const isUser = (token) => {
  return hasRole(token, 'USER');
};

export const isAdmin = (token) => {
  return hasRole(token, 'ADMIN');
};
