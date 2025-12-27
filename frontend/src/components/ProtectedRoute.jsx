import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ProtectedRoute uses AuthContext to decide access.
// Props:
// - adminViewRequired: if true, require user.role === 'admin' and viewMode === 'admin'
// - allowedRoles: optional array of roles allowed (e.g., ['user','admin'])
export default function ProtectedRoute({ adminViewRequired = false, allowedRoles = null, redirectTo = '/' }) {
  const { user, isAuthenticated, viewMode } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (adminViewRequired) {
    if (!(user?.role === 'admin' && viewMode === 'admin')) {
      return <Navigate to="/admin-secret-login" replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
