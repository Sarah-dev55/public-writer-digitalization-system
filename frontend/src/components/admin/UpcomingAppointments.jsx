import React from 'react';

/**
 * UpcomingAppointments Component
 * Displays a list of upcoming appointments on the admin dashboard
 */
export default function UpcomingAppointments({ appointments = [] }) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No upcoming appointments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <span className="text-sm text-gray-500">{appointments.length} total</span>
      </div>
      <div className="space-y-3">
        {appointments.slice(0, 5).map((apt, idx) => (
          <div
            key={apt._id || apt.id || idx}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="font-medium text-gray-900">
                  {apt.notes || apt.appointmentType || 'Appointment'}
                </p>
                <p className="text-sm text-gray-600">
                  {apt.date} • {apt.timeSlot}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {apt.status || 'scheduled'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {appointments.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all appointments ({appointments.length})
          </button>
        </div>
      )}
    </div>
  );
}
