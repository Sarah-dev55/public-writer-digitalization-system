import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * ClientLayout: Layout wrapper for client-side pages
 * Shows client-specific navigation and sidebar
 */
export default function ClientLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Client Side Navigation */}
      <Sidebar 
        user={user}
        isAdmin={false}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={user}
          isAdmin={false}
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
