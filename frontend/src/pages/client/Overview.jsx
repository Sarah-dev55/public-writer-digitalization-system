import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedHeader from '../../components/layout/UnifiedHeader';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../components/client/HeroSection';
import ActionCards from '../../components/client/ActionCards';
import AppointmentsList from '../../components/client/AppointmentsList';
import DocumentsList from '../../components/client/DocumentsList';
import CaseProgress from '../../components/client/CaseProgress';
import Book_model from '../../components/forms/BookAppointment'; // Import the booking modal
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { listDocumentsByUser, deleteDocument } from '../../services/documentService';
import { getUserAppointments, deleteAppointment } from '../../services/clientAppointmentService';
import { getCaseStatus } from '../../services/clientUserService';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import api from '../../services/api';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Add state for modal
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);
  const [caseData, setCaseData] = useState({ progress: 0, currentPhase: 'Loading...', steps: [] });
  const [notifications, setNotifications] = useState([]);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    isLoading: false,
  });
  const navigate = useNavigate();

  // Temporary userId until authentication is implemented
  const userId = '692cb332a4ba90e0b2dcb02f';

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
    fetchDocuments();
    fetchCaseStatus();
    fetchNotifications();

    // Poll for notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update local state to reflect read status
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const fetchCaseStatus = async () => {
    try {
      const data = await getCaseStatus(userId);
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case status:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const data = await listDocumentsByUser(userId);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getUserAppointments(userId);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Still set appointments to empty array on error
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    setSelectedAppointmentData(null);
    setModalMode('create');
    setIsBookingModalOpen(true); //Open modal instead of navigating
  };

  const handleUploadDocuments = () => {
    navigate('/client/documents');
  };

  const handleBookNew = () => {
    setSelectedAppointmentData(null);
    setModalMode('create');
    setIsBookingModalOpen(true); //Open modal instead of navigating
  };

  const handleReschedule = (id) => {
    const appointment = appointments.find(apt => apt._id === id);
    if (appointment) {
      setSelectedAppointmentData(appointment);
      setModalMode('edit');
      setIsBookingModalOpen(true);
    }
  };

  const handleView = (id) => {
    const appointment = appointments.find(apt => apt._id === id);
    if (appointment) {
      setSelectedAppointmentData(appointment);
      setModalMode('view');
      setIsBookingModalOpen(true);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await deleteAppointment(id, userId);
      // Refresh appointments list after successful deletion
      await fetchAppointments();
      alert('Appointment canceled successfully');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Error canceling appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBookingClose = () => {
    setIsBookingModalOpen(false);
    // Refresh appointments when modal closes (in case a new one was booked)
    fetchAppointments();
  };

  const handleDocumentUpload = (id) => {
    console.log('Upload document:', id);
    navigate('/client/documents');
  };

  const handleDocumentDelete = (id) => {
    const docToDelete = documents.find(d => d._id === id);
    const docName = docToDelete ? docToDelete.name : 'this document';

    setConfirmationDialog({
      isOpen: true,
      title: 'Delete Document',
      message: `Are you sure you want to delete "${docName}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          setConfirmationDialog(prev => ({ ...prev, isLoading: true }));
          await deleteDocument(id, userId);
          await fetchDocuments();
          
          setConfirmationDialog({
            isOpen: true,
            title: 'Success',
            message: 'Document deleted successfully',
            type: 'success',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        } catch (error) {
          console.error('Error deleting document:', error);
          setConfirmationDialog({
            isOpen: true,
            title: 'Error',
            message: 'Failed to delete document',
            type: 'danger',
            onConfirm: () => setConfirmationDialog(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            cancelText: '',
            isLoading: false,
          });
        }
      },
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isLoading: false,
    });
  };

  const handleDocumentView = async (id) => {
    try {
      const response = await api.get(`/client/documents/${id}/view`);
      if (response.data.url) {
        const baseUrl = api.defaults.baseURL.replace(/\/api$/, '');
        window.open(`${baseUrl}${response.data.url}`, '_blank');
      } else {
        alert('Document file not available');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to view document');
    }
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
        
        <HeroSection 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
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
            appointments={appointments}
            loading={loading}
            onBookNew={handleBookNew}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onView={handleView}
          />
        )}

        
        {activeTab === 'documents' && (
          <DocumentsList
            documents={documents}
            onUpload={handleDocumentUpload}
            onView={handleDocumentView}
            onDelete={handleDocumentDelete}
            onUploadNew={handleUploadNew}
          />
        )}
        
        {activeTab === 'progress' && (
          <CaseProgress 
            progress={caseData.progress} 
            currentPhase={caseData.currentPhase} 
            steps={caseData.steps} 
          />
        )}
      </main>
      
      <Footer />
      
      {/*Add the booking modal component */}
      <Book_model 
        isOpen={isBookingModalOpen} 
        onClose={handleBookingClose}
        mode={modalMode}
        appointment={selectedAppointmentData}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm || (() => setConfirmationDialog(prev => ({ ...prev, isOpen: false })))}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        type={confirmationDialog.type}
        confirmText={confirmationDialog.confirmText || 'Confirm'}
        cancelText={confirmationDialog.cancelText || 'Cancel'}
        isLoading={confirmationDialog.isLoading}
      />
    </div>
  );
}