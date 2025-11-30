import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/client/HeroSection';
import ActionCards from '../../components/client/ActionCards';
import AppointmentsList from '../../components/client/AppointmentsList';
import DocumentsList from '../../components/client/DocumentsList';
import CaseProgress from '../../components/client/CaseProgress';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/client/appointments');
  };

  const handleUploadDocuments = () => {
    navigate('/client/documents');
  };

  const handleBookNew = () => {
    navigate('/client/appointments');
  };

  const handleReschedule = (id) => {
    console.log('Reschedule appointment:', id);
    // Add reschedule logic here
  };

  const handleCancel = (id) => {
    console.log('Cancel appointment:', id);
    // Add cancel logic here
  };

  const handleDocumentUpload = (id) => {
    console.log('Upload document:', id);
    navigate('/client/documents');
  };

  const handleDocumentDownload = (id) => {
    console.log('Download document:', id);
    // Add download logic here
  };

  const handleDocumentView = (id) => {
    console.log('View document:', id);
    // Add view logic here
  };

  const handleUploadNew = () => {
    navigate('/client/documents');
  };

  const menuItems = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'BLOG', href: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header
        logo="MENSEUR"
        email="Disnmarketir@gmail.com"
        phone="(+92) 123-456-789"
        menuItems={menuItems}
      />
      
      <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main>
        {/* Action Cards - Always visible */}
        <ActionCards
          onBookAppointment={handleBookAppointment}
          onUploadDocuments={handleUploadDocuments}
        />
        
        {/* Tab Content */}
        {activeTab === 'appointments' && (
          <AppointmentsList
            onBookNew={handleBookNew}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        )}
        
        {activeTab === 'documents' && (
          <DocumentsList
            onUpload={handleDocumentUpload}
            onDownload={handleDocumentDownload}
            onView={handleDocumentView}
            onUploadNew={handleUploadNew}
          />
        )}
        
        {activeTab === 'progress' && (
          <CaseProgress progress={66} currentPhase="Document Preparation" />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

