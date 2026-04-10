import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('PARENT' | 'DRIVER' | 'ADMIN')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    // Role not authorized, redirect to their respective dashboards
    const roleRoutes: Record<string, string> = {
      'PARENT': '/parent',
      'DRIVER': '/driver',
      'ADMIN': '/admin'
    };
    const redirectPath = roleRoutes[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // All valid, render children directly or via layout
  return <Outlet />;
};

export default ProtectedRoute;
