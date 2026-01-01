import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

/**
 * AdminLayout: Layout wrapper for admin-side pages
 * Shows admin-specific navigation and sidebar
 */
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Admin Side Navigation */}
      <AdminSidebar 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader 
          user={user}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
