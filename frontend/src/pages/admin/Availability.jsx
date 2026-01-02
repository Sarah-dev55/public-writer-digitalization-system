import React, { useEffect, useState } from 'react';
import { getAllAvailability, createAvailability, deleteAvailability } from '../../services/adminAvailabilityService';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AvailabilityCalendar from '../../components/admin/AvailabilityCalendar';

// Admin page for managing calendar availability - block/unblock dates
export default function Availability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load blocked dates on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getAllAvailability();
        if (res && res.success && mounted) setAvailability(res.data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load availability');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Toggle date availability - block or unblock a specific date
  const handleToggleDay = async (dateStr, makeBlocked) => {
    try {
      if (makeBlocked) {
        // Create a new NoWorkDay (block the date)
        const res = await createAvailability({ date: dateStr, isRecurring: false, reason: 'Admin blocked' });
        if (res && res.success && res.data) {
          // Use the returned data (includes _id) so deletion will work later
          setAvailability((prev) => [...prev, res.data]);
          setSuccessMsg('Day blocked successfully');
          setTimeout(() => setSuccessMsg(null), 3000);
        }
      } else {
        // Find the blocked day by date and delete it
        const found = availability.find((a) => a.date === dateStr);
        if (found && found._id) {
          const res = await deleteAvailability(found._id);
          if (res && res.success) {
            setAvailability((prev) => prev.filter((a) => a._id !== found._id));
            setSuccessMsg('Day unblocked successfully');
            setTimeout(() => setSuccessMsg(null), 3000);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update availability');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Availability" breadcrumb={['Homepage', 'Availability']} />
      <div className="pt-20 lg:pl-64">
        <AdminSidebar />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Manage Availability</h2>
            <p className="text-gray-600">Block or unblock dates to manage your schedule.</p>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-gray-500">Loading availability...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                  <AvailabilityCalendar availability={availability} onToggleDay={handleToggleDay} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Blocked Dates</h3>
                {availability && availability.length > 0 ? (
                  <div className="space-y-2">
                    {availability.map((a, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{a.date}</p>
                          <p className="text-xs text-gray-500">{a.reason || 'No reason'}</p>
                        </div>
                        <button
                          onClick={() => handleToggleDay(a.date, false)}
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No blocked dates</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
