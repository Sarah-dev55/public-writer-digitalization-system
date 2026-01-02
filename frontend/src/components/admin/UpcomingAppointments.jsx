import React, { useState } from 'react';

/**
 * UpcomingAppointments Component
 * Displays a list of upcoming appointments on the admin dashboard
 */
export default function UpcomingAppointments({ appointments = [] }) {
  const [showAll, setShowAll] = useState(false);
  
  const getStatusLabel = (status) => {
    const labels = {
      1: 'Step 1 - Initial',
      2: 'Step 2 - Collection',
      3: 'Step 3 - Review',
      4: 'Step 4 - Preparation',
      5: 'Step 5 - Complete'
    };
    return labels[status] || `Step ${status}`;
  };
  
  const getStatusColor = (status) => {
    if (status === 5) return 'bg-app-secondary/20 text-app-secondary';
    if (status >= 3) return 'bg-app-secondary/30 text-app-primary';
    return 'bg-app-accent text-app-primary';
  };
  
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border border-app-primary/10">
        <h3 className="text-lg font-semibold mb-4 text-app-primary">Upcoming Appointments</h3>
        <div className="text-center py-8 text-app-primary/60">
          <svg className="w-12 h-12 mx-auto mb-3 text-app-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No upcoming appointments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-app-primary/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-app-primary">Upcoming Appointments</h3>
        <span className="text-sm text-app-primary/60">{appointments.length} total</span>
      </div>
      <div className="space-y-3">
        {(showAll ? appointments : appointments.slice(0, 5)).map((apt, idx) => (
          <div
            key={apt._id || apt.id || idx}
            className="flex items-center justify-between p-3 bg-app-accent/30 rounded-lg border border-app-primary/10 hover:bg-app-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-app-secondary"></div>
              <div>
                <p className="font-semibold text-app-primary">{apt.userName || 'Unknown user'}</p>
                <p className="text-sm text-app-primary/70">{apt.date} • {apt.timeSlot}</p>
                {apt.userStatus && (
                  <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium ${getStatusColor(apt.userStatus)}`}>
                    {getStatusLabel(apt.userStatus)}
                  </span>
                )}
                {apt.notes ? (
                  <p className="text-sm text-app-primary/80 truncate">Notes: {apt.notes}</p>
                ) : null}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${
                (apt.status === 'confirmed' || apt.status === 'scheduled') ? 'bg-app-secondary/20 text-app-secondary' :
                apt.status === 'completed' ? 'bg-app-primary/20 text-app-primary' :
                'bg-app-accent text-app-primary'
              }`}>
                {apt.status || 'scheduled'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {appointments.length > 5 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-app-secondary hover:text-app-primary font-medium transition-colors"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Show less' : `View all appointments (${appointments.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
