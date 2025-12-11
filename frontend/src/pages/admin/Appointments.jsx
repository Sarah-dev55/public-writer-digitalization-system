import React, { useEffect, useState } from 'react';
import { getAllAppointments, updateAppointment, deleteAppointment } from '../../services/adminAppointmentService';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: '', timeSlot: '', notes: '' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getAllAppointments();
        if (res && res.success && mounted) setAppointments(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Appointments" breadcrumb={['Homepage', 'Appointments']} />
      <div className="pt-20 lg:pl-64">
        <AdminSidebar />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Manage Appointments</h2>
            <p className="text-gray-600">View and manage all scheduled appointments.</p>
          </div>
          {loading && <div className="text-gray-500">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-medium">{a.notes || 'Appointment'}</p>
              <p className="text-sm text-gray-500">{a.date} — {a.timeSlot}</p>
              <p className="text-sm text-gray-500">Client: {a.clientName || (a.userId && a.userId.fullName) || '—'}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{a.status || 'scheduled'}</span></p>
              <button onClick={() => { setEditing(a); setForm({ date: a.date || '', timeSlot: a.timeSlot || '', notes: a.notes || '' }); }} className="px-3 py-2 bg-[#31493d] text-white rounded-lg">Edit</button>
            </div>
          </div>
        ))}
          </div>

          {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-xl w-full max-w-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Appointment</h3>
                <div className="grid grid-cols-1 gap-3">
                  <label className="text-sm">Date
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="mt-1 block w-full border rounded p-2" />
                  </label>
                  <label className="text-sm">Time Slot
                    <input type="text" value={form.timeSlot} onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))} className="mt-1 block w-full border rounded p-2" />
                  </label>
                  <label className="text-sm">Notes
                    <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="mt-1 block w-full border rounded p-2" />
                  </label>
                </div>

                <div className="mt-4 flex gap-3 justify-end">
                  <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button onClick={async () => {
                    try {
                      const res = await updateAppointment(editing._id, { date: form.date, timeSlot: form.timeSlot, notes: form.notes });
                      if (res && res.success) {
                      setAppointments((prev) => prev.map((it) => it._id === editing._id ? res.data : it));
                      setEditing(null);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={async () => {
                  if (!confirm('Cancel this appointment?')) return;
                  try {
                    const res = await deleteAppointment(editing._id);
                    if (res && res.success) {
                      setAppointments((prev) => prev.filter((it) => it._id !== editing._id));
                      setEditing(null);
                    }
                  } catch (err) { console.error(err); }
                }} className="px-4 py-2 bg-red-600 text-white rounded">Cancel Appointment</button>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}
