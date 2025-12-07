import React, { useState, useMemo, useEffect } from 'react';
import DashboardStats from '../../components/admin/DashboardStats';
import UpcomingAppointments from '../../components/admin/UpcomingAppointments';
import PendingDocuments from '../../components/admin/PendingDocuments';
import AvailabilityCalendar from '../../components/admin/AvailabilityCalendar';
import DocumentReviewModal from '../../components/admin/DocumentReviewModal';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getAppointmentsByDate } from '../../services/appointmentService';
import { listDocumentsByUser, listPendingDocuments, updateDocument } from '../../services/documentService';
import { getAvailability, addNoWorkDay, removeNoWorkDay } from '../../services/availabilityService';
import api from '../../services/api';

export default function Dashboard() {
  const [documents, setDocuments] = useState([
    // initial placeholder until data loads
    { id: 'd1', title: 'Passport Scan', clientName: 'A. Johnson', submittedDate: '2 days ago', fileUrl: '' },
    { id: 'd2', title: 'Driver License', clientName: 'B. Williams', submittedDate: '3 days ago', fileUrl: '' },
    { id: 'd3', title: 'Tax Document', clientName: 'C. Brown', submittedDate: '5 days ago', fileUrl: '' }
  ]);

  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);

        // fetch appointments for today
        const apptRes = await getAppointmentsByDate(today);
        if (apptRes && apptRes.success) setAppointments(apptRes.data || []);

        // fetch first user to use for listing documents (seed creates one user)
        const usersRes = await api.get('/api/users');
        let userId = null;
        if (usersRes && usersRes.data && usersRes.data.success && usersRes.data.data && usersRes.data.data.length > 0) {
          userId = usersRes.data.data[0]._id;
        }

        // fetch pending documents (admin)
        const pendingRes = await listPendingDocuments();
        if (pendingRes && pendingRes.success) {
          const list = (pendingRes.data || []).map((d) => ({ id: d._id || d.id, title: d.fileName || d.title || 'Document', clientName: d.userId || 'Client', submittedDate: d.uploadedAt || d.createdAt || '' , ...d }));
          setDocuments(list);
        }

        // availability
        const availRes = await getAvailability();
        if (availRes && availRes.success) setAvailability(availRes.data || []);
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

  const handleReview = (doc) => {
    setSelectedDocument(doc);
  };

  const handleCloseModal = () => setSelectedDocument(null);

  const handleAccept = () => {
    if (!selectedDocument) return;
    (async () => {
      try {
        const res = await updateDocument(selectedDocument._id || selectedDocument.id, { status: 'accepted' });
        if (res && res.data && res.data.success) {
          setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== (selectedDocument._id || selectedDocument.id)));
          setSelectedDocument(null);
        } else if (res && res.success) {
          setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== (selectedDocument._id || selectedDocument.id)));
          setSelectedDocument(null);
        }
      } catch (err) {
        console.error('Accept error', err);
      }
    })();
  };

  const handleReject = () => {
    if (!selectedDocument) return;
    (async () => {
      try {
        const res = await updateDocument(selectedDocument._id || selectedDocument.id, { status: 'rejected' });
        if (res && res.data && res.data.success) {
          setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== (selectedDocument._id || selectedDocument.id)));
          setSelectedDocument(null);
        } else if (res && res.success) {
          setDocuments((prev) => prev.filter((d) => (d._id || d.id) !== (selectedDocument._id || selectedDocument.id)));
          setSelectedDocument(null);
        }
      } catch (err) {
        console.error('Reject error', err);
      }
    })();
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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Dashboard" breadcrumb={["Homepage","Dashboard"]} />

      <div className="pt-20 lg:pl-64">{/* reserve header height */}
        <AdminSidebar />

        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-600">Overview and quick actions for admins.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DashboardStats pendingCount={pendingCount} />

              <div className="space-y-6">
                <UpcomingAppointments appointments={appointments} />
                <PendingDocuments documents={documents} onReview={handleReview} onAccept={handleInlineAccept} onReject={handleInlineReject} />
              </div>
            </div>

            <div>
              <AvailabilityCalendar availability={availability} onToggleDay={async (dateStr, makeBlocked) => {
                try {
                  if (makeBlocked) {
                    // create no-work-day (block)
                    const res = await addNoWorkDay({ date: dateStr, isRecurring: false, reason: 'Blocked via admin' });
                    if (res && res.success) setAvailability((prev) => [ ...(prev || []), res.data ]);
                  } else {
                    // remove existing no-work-day for that date
                    const found = (availability || []).find((a) => a.date && a.date.startsWith(dateStr));
                    // find by exact match
                    const exact = (availability || []).find((a) => a.date === dateStr);
                    const target = exact || found;
                    if (target && target._id) {
                      const rem = await removeNoWorkDay(target._id);
                      if (rem && rem.success) setAvailability((prev) => (prev || []).filter((p) => p._id !== target._id));
                    }
                  }
                } catch (err) {
                  console.error('Availability toggle error', err);
                }
              }} />
            </div>
          </div>
        </main>
      </div>

      {selectedDocument && (
        <DocumentReviewModal
          document={selectedDocument}
          onClose={handleCloseModal}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
