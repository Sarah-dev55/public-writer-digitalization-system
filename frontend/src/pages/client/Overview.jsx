import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedHeader from '../../components/layout/UnifiedHeader';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/client/HeroSection';
import ActionCards from '../../components/client/ActionCards';
import AppointmentsList from '../../components/client/AppointmentsList';
import DocumentsList from '../../components/client/DocumentsList';
import CaseProgress from '../../components/client/CaseProgress';
import Book_model from '../../components/forms/BookAppointment'; // Import the booking modal

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Add state for modal
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    setIsBookingModalOpen(true); //Open modal instead of navigating
  };

  const handleUploadDocuments = () => {
    navigate('/client/documents');
  };

  const handleBookNew = () => {
    setIsBookingModalOpen(true); //Open modal instead of navigating
  };

  const handleReschedule = (id) => {
    console.log('Reschedule appointment:', id);
    setIsBookingModalOpen(true); // Open modal for rescheduling
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
    { label: 'HOME', active: false, href: '/' },
    { label: 'ABOUT US', active: false, href: '/about' },
    { label: 'CONTACT US', active: false, href: '/contact' },
    { label: 'BLOG', active: false, href: '/blog' },
  ];

  const testUser = {
    name: "Sarah Smith",
    avatar: null
  };

  return (
    <div className="min-h-screen bg-app-accent">
      {/* Header and Hero Section Container */}
      <div 
        className="relative w-full bg-cover bg-center flex flex-col"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(52, 78, 65, 0.95) 32%, rgba(0, 0, 0, 0.13) 100%), url('/assets/images/backgroud_picture.jpg')`,
        }}
      >
        <UnifiedHeader
          navItems={menuItems}
          logoImage="/assets/images/Logo.png"
          logoOnClick={() => navigate('/')}
          ctaButtonText="Get Started"
          ctaButtonOnClick={() => navigate('/client/dashboard')}
          showUser={true}
          user={testUser}
          navClassName="bg-transparent"
        />
        
        <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
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
      
      {/*Add the booking modal component */}
      <Book_model 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}