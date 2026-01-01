import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function AdminHeader({ title = 'Dashboard', breadcrumb = ['Homepage', 'Dashboard'] }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const bg = '#31493d';
  const accent = '#f5f5dc';



  return (
    <header style={{ background: bg }} className="w-full fixed top-0 left-0 z-30">
      <div className="max-w-full mx-auto px-6" style={{ color: accent }}>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#3f5d4e] rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4z" fill="#fff" opacity="0.04" />
              </svg>
            </div>

            <div>
              <div className="text-sm opacity-80">{title}</div>
              <div className="text-xs opacity-60 text-[#d9e6dd]">{breadcrumb.join(' > ')}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/5" aria-label="notifications">
              <svg className="w-5 h-5 text-[#f5f5dc]" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="#f5f5dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full hover:bg-white/5 flex items-center gap-2"
                aria-label="user menu"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl" style={{ background: '#1f3a2a' }}>
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-[#f5f5dc]">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-[#d9e6dd]">{user?.email || 'admin@example.com'}</p>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
