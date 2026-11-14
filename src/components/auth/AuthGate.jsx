import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PublicOnly - Redirects authenticated users away from public pages (/, /login, /signup)
 * to the dashboard (/home). Unauthenticated users see the children.
 */
export const PublicOnly = ({ children, redirectTo = "/home" }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    // Show nothing while loading - prevents flash of public page
    return null;
  }

  if (isAuthenticated) {
    // Preserve the intended destination if coming from a deep link
    const from = location.state?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  return children;
};

/**
 * PrivateOnly - Redirects unauthenticated users to login. Authenticated users see children.
 */
export const PrivateOnly = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};