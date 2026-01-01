import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, LogOut } from 'lucide-react';

/**
 * Sidebar: Client-side navigation menu
 * Shows only client-related menu items
 */
export default function Sidebar({ user, isAdmin = false, onLogout }) {
  const { t } = useTranslation();
  const location = useLocation();

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  // Client-only menu items
  const menuItems = [
    {
      label: t('dashboard.overview') || 'Overview',
      icon: Home,
      href: '/client/overview',
      path: '/client/overview'
    },
    {
      label: t('navigation.appointments') || 'Appointments',
      icon: Calendar,
      href: '/client/appointments',
      path: '/client/appointments'
    },
    {
      label: t('navigation.documents') || 'Documents',
      icon: FileText,
      href: '/client/documents',
      path: '/client/documents'
    }
  ];

  return (
    <aside className="w-60 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white min-h-screen flex flex-col fixed h-full left-0 top-0 shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-500">
        <h2 className="text-xl font-bold text-white">
          {isAdmin ? 'Admin Panel' : 'Client Portal'}
        </h2>
        <p className="text-sm text-indigo-200 mt-1">
          {user?.fullName || 'Welcome'}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <a
              key={item.path}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-white text-indigo-600 shadow-md font-semibold'
                  : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-indigo-500">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-500 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('common.logout') || 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
