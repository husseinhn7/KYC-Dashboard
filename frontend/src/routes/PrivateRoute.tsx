import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { canAccessRoute } from '../utils/roleUtils';
import type { UserRole } from '../types';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const accessToken = Cookies.get('accessToken');
  const role = Cookies.get('role') as UserRole | undefined;

  // Redirect to login if not authenticated
  if (!accessToken || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specific roles are required
  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check route-specific permissions
  if (!canAccessRoute(role, location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;