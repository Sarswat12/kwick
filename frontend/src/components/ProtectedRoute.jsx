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
    redirectTo,
    user: user
  });

  // Not authenticated at all - redirect to login
  if (!isAuthenticated) {
    console.log(`[ProtectedRoute] ${now} ❌ Not authenticated, redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  // Admin view required - check both role AND viewMode
  if (adminViewRequired) {
    const isAdminRole = user?.role === 'admin';
    const isAdminView = viewMode === 'admin';
    
    if (!isAdminRole || !isAdminView) {
      console.log(`[ProtectedRoute] ${now} ❌ Admin access denied:`, {
        hasAdminRole: isAdminRole,
        hasAdminView: isAdminView,
        actualRole: user?.role,
        actualView: viewMode
      });
      console.log(`[ProtectedRoute] ${now} → Redirecting to /admin-secret-login`);
      return <Navigate to="/admin-secret-login" replace />;
    }
  }

  // Check allowed roles
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log(`[ProtectedRoute] ${now} ❌ Role '${user?.role}' not in allowed: [${allowedRoles.join(', ')}]`);
    console.log(`[ProtectedRoute] ${now} → Redirecting to ${redirectTo}`);
    return <Navigate to={redirectTo} replace />;
  }

  console.log(`[ProtectedRoute] ${now} ✅ Access granted - role: ${user?.role}, view: ${viewMode}`);
  return <Outlet />;
}
