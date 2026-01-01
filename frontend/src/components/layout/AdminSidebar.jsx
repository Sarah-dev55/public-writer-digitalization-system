import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar() {
  const { t } = useTranslation();
  
  const items = [
    { label: t('admin.dashboard'), href: '/admin/dashboard', icon: 'dashboard', active: true },
    { label: t('navigation.appointments'), href: '/admin/appointments', icon: 'calendar' },
    { label: t('navigation.documents'), href: '/admin/documents', icon: 'file' },
    { label: t('admin.availability'), href: '/admin/availability', icon: 'availability' },
    { label: t('admin.clients'), href: '/admin/clients', icon: 'users' },
    { label: t('common.settings'), href: '/admin/settings', icon: 'settings' },
  ];

  const Icon = ({ name }) => {
    switch (name) {
      case 'dashboard':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" stroke="#fff"/>
            <rect x="14" y="3" width="7" height="4" strokeWidth="1.5" stroke="#fff"/>
            <rect x="14" y="11" width="7" height="10" strokeWidth="1.5" stroke="#fff"/>
            <rect x="3" y="11" width="7" height="7" strokeWidth="1.5" stroke="#fff"/>
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
            <path d="M16 2v4M8 2v4" strokeWidth="1.5" />
            <path d="M3 10h18" strokeWidth="1.5" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5" />
            <path d="M14 2v6h6" strokeWidth="1.5" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeWidth="1.5" />
            <circle cx="9" cy="7" r="4" strokeWidth="1.5" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="1.5" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="1.5" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" strokeWidth="1.5" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.68 0 1.24-.42 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06c.46.46 1.08.67 1.72.52.63-.15 1.16-.6 1.4-1.2.24-.6.06-1.27-.45-1.77L8.66 2.34A2 2 0 0 1 11.49.5l.06.06c.46.46 1.08.67 1.72.52.63-.15 1.16-.6 1.4-1.2.24-.6.06-1.27-.45-1.77" strokeWidth="0.8" />
          </svg>
        );
      case 'availability':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
            <path d="M16 2v4M8 2v4" strokeWidth="1.5" />
            <path d="M3 10h18" strokeWidth="1.5" />
            <path d="M7 14l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#31493d] text-white shadow-lg z-40">
      <div className="p-6 border-b border-white/10">
        <div className="w-12 h-12 bg-[#3f5d4e] rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18v12H3z" fill="#fff" opacity="0.06" />
          </svg>
        </div>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {items.map((it) => (
          <Link key={it.label} to={it.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${it.active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
            <Icon name={it.icon} />
            <span className="font-medium">{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 w-full px-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M9 21H5a2 2 0 0 1-2-2V7" strokeWidth="1.5" /><path d="M16 17l5-5-5-5" strokeWidth="1.5" /><path d="M21 12H9" strokeWidth="1.5" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
