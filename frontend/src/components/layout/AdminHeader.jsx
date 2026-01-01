import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHeader({ title = 'Dashboard', breadcrumb = ['Homepage', 'Dashboard'] }) {
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

            <button className="p-2 rounded-md hover:bg-white/5" aria-label="menu">
              <svg className="w-6 h-6 text-[#f5f5dc]" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#f5f5dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
