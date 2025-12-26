import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-islamic-primary-green" aria-hidden="true"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home page if not admin but admin access is required
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};
