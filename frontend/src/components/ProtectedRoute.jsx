import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ProtectedRoute uses AuthContext to decide access.
// Props:
// - adminViewRequired: if true, require user.role === 'admin' and viewMode === 'admin'
// - allowedRoles: optional array of roles allowed (e.g., ['user','admin'])
export default function ProtectedRoute({ adminViewRequired = false, allowedRoles = null, redirectTo = '/' }) {
  const { user, isAuthenticated, viewMode } = useAuth();

  // Debug logging with timestamp
  const now = new Date().toLocaleTimeString();
  console.log(`[ProtectedRoute] ${now} Checking access:`, {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    viewMode,
    adminViewRequired,
    user: user
  });

  if (!isAuthenticated) {
    console.log(`[ProtectedRoute] ${now} Not authenticated, redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  if (adminViewRequired) {
    if (!(user?.role === 'admin' && viewMode === 'admin')) {
      console.log(`[ProtectedRoute] ${now} Admin view required but conditions not met:`, {
        isAdmin: user?.role === 'admin',
        isAdminView: viewMode === 'admin'
      });
      return <Navigate to="/admin-secret-login" replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log(`[ProtectedRoute] ${now} Role not allowed - user role: ${user?.role}, allowed: ${allowedRoles.join(',')}, redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  console.log(`[ProtectedRoute] ${now} Access granted - user is ${user?.role}`);
  return <Outlet />;
}
