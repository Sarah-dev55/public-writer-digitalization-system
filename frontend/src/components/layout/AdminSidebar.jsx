import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, FileText, Clock, Users, Settings, LogOut } from 'lucide-react';

/**
 * AdminSidebar: Admin-side navigation menu
 * Shows only admin-related menu items
 */
export default function AdminSidebar({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  // Admin-only menu items
  const menuItems = [
    {
      label: t('admin.dashboard') || 'Dashboard',
      icon: Home,
      href: '/admin/dashboard',
      path: '/admin/dashboard'
    },
    {
      label: t('navigation.appointments') || 'Appointments',
      icon: Calendar,
      href: '/admin/appointments',
      path: '/admin/appointments'
    },
    {
      label: t('navigation.documents') || 'Documents',
      icon: FileText,
      href: '/admin/documents',
      path: '/admin/documents'
    },
    {
      label: t('admin.availability') || 'Availability',
      icon: Clock,
      href: '/admin/availability',
      path: '/admin/availability'
    },
    {
      label: t('admin.clients') || 'Clients',
      icon: Users,
      href: '/admin/clients',
      path: '/admin/clients'
    },
    {
      label: t('common.settings') || 'Settings',
      icon: Settings,
      href: '/admin/settings',
      path: '/admin/settings'
    }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white min-h-screen flex flex-col fixed h-full left-0 top-0 shadow-xl z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          Admin Panel
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {user?.fullName || 'Administrator'}
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
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={async () => {
            try {
              await logout();
              navigate('/');
            } catch (error) {
              console.error('Logout failed', error);
            }
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('common.logout') || 'Logout'}</span>
        </button>
      </div>
    </aside>
  );
}
