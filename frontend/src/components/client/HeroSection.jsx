import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

export default function HeroSection({ activeTab = 'appointments', onTabChange }) {
  return (
    <div className="relative w-full py-16 px-4 lg:px-0 text-white">
      <div className="container mx-auto relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-white">
          <Link to="/" className="hover:underline">HOMEPAGE</Link>
          <span className="mx-2">›</span>
          <span className="font-semibold">CLIENT DASHBOARD</span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
          Online Appointment Booking
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl mb-12 max-w-3xl leading-relaxed text-white">
          you are tired from waiting hours in long queue to benefit from Mr Menselir session, book your Appointment know and upload your document easily before the appointment, only in one place.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => onTabChange('appointments')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-app-primary text-app-text-light'
                : 'bg-app-primary text-app-text-light opacity-70 hover:opacity-100'
            }`}
          >
            Appointments
          </button>
          
          <button
            onClick={() => onTabChange('documents')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'documents'
                ? 'bg-app-primary text-app-text-light'
                : 'bg-app-primary text-app-text-light opacity-70 hover:opacity-100'
            }`}
          >
            Documents
          </button>
          
          <button
            onClick={() => onTabChange('progress')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'progress'
                ? 'bg-app-secondary text-app-text-light'
                : 'bg-app-secondary text-app-text-light opacity-70 hover:opacity-100'
            }`}
          >
            Progress
          </button>

          {/* Notification Bell - Outside the Progress button */}
          <NotificationDropdown />
        </div>
      </div>
    </div>
  );
}

