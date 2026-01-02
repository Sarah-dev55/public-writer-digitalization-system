import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationDropdown from './NotificationDropdown';

export default function HeroSection({ 
  activeTab = 'appointments', 
  onTabChange, 
  notifications = [], 
  onMarkAsRead, 
  onMarkAllAsRead,
  user
}) {
  const { t } = useTranslation();
  
  const getStatusLabel = (status) => {
    const labels = {
      1: 'Step 1: Initial Consultation',
      2: 'Step 2: Document Collection',
      3: 'Step 3: Document Review',
      4: 'Step 4: Document Preparation',
      5: 'Step 5: Complete'
    };
    return labels[status] || `Step ${status}`;
  };
  
  const getStatusColor = (status) => {
    if (status === 5) return 'bg-green-500';
    if (status >= 3) return 'bg-blue-500';
    return 'bg-yellow-500';
  };
  
  return (
    <div className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white">
      <div className="container mx-auto relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-white px-2 sm:px-0">
          <Link to="/" className="hover:underline">{t('navigation.home').toUpperCase()}</Link>
          <span className="mx-2">›</span>
          <span className="font-semibold">{t('dashboard.clientDashboard')}</span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white px-2 sm:px-0">
          {t('dashboard.onlineAppointmentBooking')}
        </h1>
        
        {/* User Status Badge */}
        {user?.currentStats && (
          <div className="mb-6 px-2 sm:px-0">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(user.currentStats)} text-white font-semibold text-sm`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {getStatusLabel(user.currentStats)}
            </div>
          </div>
        )}
        
        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-3xl leading-relaxed text-white px-2 sm:px-0">
          {t('dashboard.dashboardDescription')}
        </p>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center px-2 sm:px-0">
          <button
            onClick={() => onTabChange('appointments')}
            className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-app-secondary text-app-text-light'
                : 'bg-transparent border-2 border-app-primary text-app-text-light hover:bg-app-primary/20'
            }`}
          >
            {t('navigation.appointments')}
          </button>
          
          <button
            onClick={() => onTabChange('documents')}
            className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'documents'
             ?  'bg-app-secondary text-app-text-light'
                : 'bg-transparent border-2 border-app-primary text-app-text-light hover:bg-app-primary/20'
            }`}
          >
            {t('navigation.documents')}
          </button>
          
          <button
            onClick={() => onTabChange('progress')}
            className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all ${
              activeTab === 'progress'
                ? 'bg-app-secondary text-app-text-light'
                : 'bg-transparent border-2 border-app-primary text-app-text-light hover:bg-app-primary/20'
            }`}
          >
            {t('dashboard.progress')}
          </button>

          {/* Notification Bell - Outside the Progress button */}
          <NotificationDropdown 
            notifications={notifications} 
            onMarkAsRead={onMarkAsRead} 
            onMarkAllAsRead={onMarkAllAsRead} 
          />
        </div>
      </div>
    </div>
  );
}

