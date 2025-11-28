import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({ activeTab = 'appointments', onTabChange }) {
  return (
    <div className="relative  bg-cover bg-center bg-no-repeat py-20 px-6 lg:px-0 ] text-white py-16 px-4 overflow-hidden">
      {/* Background Image - Hands Shaking */}
        <div className="absolute inset-0 ">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
          backgroundImage: `url("/assets/images/backgroud_picture.jpg")`,
          backgroundPosition: 'right center',
          backgroundSize: ''
            }}
          ></div>
        </div>
        
        {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d4a3e] via-[#2d4a3e] to-[#1a3528] opacity-90"></div>
      
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
                ? 'bg-[#2d4a3e] text-white'
                : 'bg-[#2d4a3e] text-white opacity-70 hover:opacity-100'
            }`}
          >
            Appointments
          </button>
          
          <button
            onClick={() => onTabChange('documents')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'documents'
                ? 'bg-[#2d4a3e] text-white'
                : 'bg-[#2d4a3e] text-white opacity-70 hover:opacity-100'
            }`}
          >
            Documents
          </button>
          
          <button
            onClick={() => onTabChange('progress')}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'progress'
                ? 'bg-[#5a7a66] text-white'
                : 'bg-[#5a7a66] text-white opacity-70 hover:opacity-100'
            }`}
          >
            Progress
            <span className="w-6 h-6 rounded-full bg-[#2d4a3e] flex items-center justify-center text-white text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

