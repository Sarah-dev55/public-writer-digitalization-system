import React, { useState, useMemo, useEffect } from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import UpcomingAppointments from '../../components/admin/UpcomingAppointments';
import PendingDocuments from '../../components/admin/PendingDocuments';
import DocumentReviewModal from '../../components/admin/DocumentReviewModal';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getAllAppointments } from '../../services/adminAppointmentService';
import { getPendingDocuments, updateDocument } from '../../services/adminDocumentService';
import { getAllUsers } from '../../services/adminUserService';

export default function Dashboard() {
  const [documents, setDocuments] = useState([
    // initial placeholder until data loads
    { id: 'd1', title: 'Passport Scan', clientName: 'A. Johnson', submittedDate: '2 days ago', fileUrl: '' },
    { id: 'd2', title: 'Driver License', clientName: 'B. Williams', submittedDate: '3 days ago', fileUrl: '' },
    { id: 'd3', title: 'Tax Document', clientName: 'C. Brown', submittedDate: '5 days ago', fileUrl: '' }
  ]);

  const [appointments, setAppointments] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [apptRes, usersRes, pendingRes] = await Promise.all([
          getAllAppointments(),
          getAllUsers(),
          getPendingDocuments(),
        ]);

        const apptList = Array.isArray(apptRes?.data) ? apptRes.data : Array.isArray(apptRes) ? apptRes : [];
        const users = Array.isArray(usersRes?.data) ? usersRes.data : Array.isArray(usersRes) ? usersRes : [];

        const userMap = users.reduce((acc, u) => {
          if (u?._id) acc[u._id] = u;
          return acc;
        }, {});

        setUsersCount(users.length);

        const mappedAppts = apptList
          .map((a) => {
            const user = userMap[a.userId];
            const userName = user?.fullName || user?.name || user?.email || 'Unknown user';
            const userStatus = user?.currentStats || 1;

            const dateValue = a.date || a.appointmentDate;
            const timeValue = a.timeSlot || a.time || a.slot;
            let dateTime = null;
            if (dateValue && timeValue) {
              dateTime = new Date(`${dateValue} ${timeValue}`);
            }

            return {
              ...a,
              userName,
              userStatus,
              date: dateValue,
              timeSlot: timeValue,
              reservationDateTime: dateTime?.getTime() || Number.MAX_SAFE_INTEGER,
            };
          })
          .sort((a, b) => a.reservationDateTime - b.reservationDateTime);

        setAppointments(mappedAppts);

        if (pendingRes && pendingRes.success) {
          const list = (pendingRes.data || []).map((d) => ({ id: d._id || d.id, title: d.fileName || d.title || 'Document', clientName: d.userId || 'Client', submittedDate: d.uploadedAt || d.createdAt || '' , ...d }));
          setDocuments(list);
        }

      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const [selectedDocument, setSelectedDocument] = useState(null);

  const pendingCount = useMemo(() => documents.length, [documents]);
  const appointmentsCount = useMemo(() => appointments.length, [appointments]);

  const handleReview = (doc) => {
    setSelectedDocument(doc);
  };

  const handleCloseModal = () => setSelectedDocument(null);

  const handleStatusUpdated = (updatedDocument) => {
    console.log('Status updated:', updatedDocument);
    console.log('Updated status:', updatedDocument.status);
    
    // Close the modal
    setSelectedDocument(null);
    
    // Immediately update the local state - remove document if status is not pending
    if (updatedDocument.status !== 'pending') {
      console.log('Removing document from list');
      setDocuments((prev) => {
        const filtered = prev.filter((d) => {
          const docId = d._id || d.id;
          const updatedId = updatedDocument._id || updatedDocument.id;
          return docId !== updatedId;
        });
        console.log('Filtered documents:', filtered);
        return filtered;
      });
    } else {
      // If still pending, update the document in the list
      console.log('Updating document in list');
      setDocuments((prev) => prev.map((d) => {
        const docId = d._id || d.id;
        const updatedId = updatedDocument._id || updatedDocument.id;
        return docId === updatedId ? { ...d, ...updatedDocument } : d;
      }));
    }
  };

  // quick handlers for inline buttons
  const handleInlineAccept = async (doc) => {
    try {
      const id = doc._id || doc.id;
      const res = await updateDocument(id, { status: 'accepted' });
      if ((res && res.data && res.data.success) || (res && res.success)) {
        setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id));
      }
    } catch (err) {
      console.error('Inline accept error:', err);
    }
  };

  const handleInlineReject = async (doc) => {
    try {
      const id = doc._id || doc.id;
      const res = await updateDocument(id, { status: 'rejected' });
      if ((res && res.data && res.data.success) || (res && res.success)) {
        setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== id));
      }
    } catch (err) {
      console.error('Inline reject error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-app-accent">
      <AdminHeader title="Dashboard" breadcrumb={["Homepage","Dashboard"]} />

      <div className="pt-20 lg:pl-64">{/* reserve header height */}
        <AdminSidebar />

        <main className="p-8 max-w-5xl mx-auto flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-app-primary">Dashboard</h2>
            <p className="text-lg text-app-primary/70">Overview and quick actions for admins.</p>
          </div>

          <div className="w-full space-y-8">
            <DashboardStats pendingCount={pendingCount} appointmentsCount={appointmentsCount} clientsCount={usersCount} />

            <div className="space-y-6">
              <UpcomingAppointments appointments={appointments} />
              <PendingDocuments
                documents={documents}
                onReview={handleReview}
                onAccept={handleInlineAccept}
                onReject={handleInlineReject}
              />
            </div>
          </div>
        </main>
      </div>

      {selectedDocument && (
        <DocumentReviewModal
          document={selectedDocument}
          onClose={handleCloseModal}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
