import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Extract domain from email
  const userDomain = currentUser.email.split('@')[1];
  
  // Determine role based on email domain
  let userRole;
  if (userDomain === 'ad.com') userRole = 'admin';
  else if (userDomain === 'oi.com') userRole = 'officer';
  else if (userDomain === 'ui.com') userRole = 'citizen';
  else userRole = 'unknown';

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to the appropriate login based on their role
    const loginPath = 
      userRole === 'admin' ? '/admin/login' :
      userRole === 'officer' ? '/officer/login' :
      '/citizen/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}