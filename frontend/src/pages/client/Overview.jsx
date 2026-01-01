import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedHeader from '../../components/layout/UnifiedHeader';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/client/HeroSection';
import ActionCards from '../../components/client/ActionCards';
import AppointmentsList from '../../components/client/AppointmentsList';
import DocumentsList from '../../components/client/DocumentsList';
import CaseProgress from '../../components/client/CaseProgress';
import Book_model from '../../components/forms/BookAppointment';
import LoginModal from '../../components/ui/LoginModal';
import ProfileModal from '../../components/ui/ProfileModal';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('Token:', token); // Debug
    console.log('User data from localStorage:', userData); // Debug

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Parsed user:', user); // Debug
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoginModalOpen(true);
      }
    } else {
      console.log('No token or user data found'); // Debug
      setIsLoginModalOpen(true);
    }
  }, []);

  const handleLogin = (user) => {
    console.log('User logged in:', user); // Debug
    setCurrentUser(user);
    setIsLoginModalOpen(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    console.log('Profile updated:', updatedUser); // Debug
    setCurrentUser(updatedUser);
  };

  const handleBookAppointment = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleUploadDocuments = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/client/documents');
  };

  const handleBookNew = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleReschedule = (id) => {
    console.log('Reschedule appointment:', id);
    setIsBookingModalOpen(true);
  };

  const handleCancel = (id) => {
    console.log('Cancel appointment:', id);
  };

  const handleDocumentUpload = (id) => {
    console.log('Upload document:', id);
    navigate('/client/documents');
  };

  const handleDocumentDownload = (id) => {
    console.log('Download document:', id);
  };

  const handleDocumentView = (id) => {
    console.log('View document:', id);
  };

  const handleDocumentDelete = (id) => {
    console.log('Delete document:', id);
  };

  const handleUploadNew = () => {
    navigate('/client/documents');
  };

  const navItems = [
    { label: "Home", active: false, href: '/#home' },
    { label: "Our Services", active: false, href: '/#about' },
    { label: "Client Reviews", active: false, href: '/#reviews' },
    { label: "How It Works", active: false, href: '/#how-it-works' },
  ];

  // Format user for header display
  const headerUser = currentUser ? {
    name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User',
    email: currentUser.email,
    phone: currentUser.phone,
    location: currentUser.location || '',
    avatar: currentUser.avatar
  } : null;

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
          navItems={navItems}
          logoImage="/assets/images/Logo.png"
          logoOnClick={() => navigate('/')}
          ctaButtonText="Get Started"
          ctaButtonOnClick={() => navigate('/client/dashboard')}
          showUser={!!currentUser}
          user={headerUser}
          onProfileClick={() => setIsProfileModalOpen(true)}
          navClassName="bg-transparent"
          contactBarClassName="bg-app-primary/90"
          showCtaButton={false}
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
            onDelete={handleDocumentDelete}
            onUploadNew={handleUploadNew}
          />
        )}
        
        {activeTab === 'progress' && (
          <CaseProgress progress={66} currentPhase="Document Preparation" />
        )}
      </main>
      
      <Footer />
      
      {/* Modals */}
      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <Book_model 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />

      {currentUser && (
        <ProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}