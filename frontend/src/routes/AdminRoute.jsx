import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Only 'admin' role can access admin routes
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
