import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AppointmentsList({ appointments = [], loading = false, onBookNew, onReschedule, onCancel, onView }) {
  const { t } = useTranslation();
  
  // Map backend data to component format
  const mapAppointmentData = (appointment) => {
    // Map appointmentType to display title
    const typeLabels = {
      'document-review': 'Document Review',
      'consultation': 'Consultation',
      'follow-up': 'Follow-up'
    };

    // Map appointmentType to duration
    const typeDurations = {
      'document-review': '45 minutes',
      'consultation': '30 minutes',
      'follow-up': '20 minutes'
    };

    return {
      id: appointment._id,
      title: typeLabels[appointment.appointmentType] || appointment.appointmentType || 'Appointment',

      date: appointment.date,
      time: appointment.timeSlot,
      duration: typeDurations[appointment.appointmentType] || '30 minutes',
      // Map any legacy 'pending' status to 'scheduled' and ensure lowercase for consistency
      status: ((appointment.status === 'pending' ? 'scheduled' : appointment.status) || 'scheduled').toLowerCase(),
    };
  };

  const displayAppointments = appointments.map(mapAppointmentData);

  const getStatusButton = (appointment) => {
    switch (appointment.status) {
      case 'completed':
        return (
          <button 
            onClick={() => onView && onView(appointment.id)}
            className="px-4 py-2 bg-app-secondary text-app-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View
          </button>
        );
      case 'scheduled':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onReschedule && onReschedule(appointment.id)}
              className="px-4 py-2 bg-[#DDA15E] hover:bg-[#BC6C25] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {t('appointments.rescheduleAppointment')}
            </button>
            <button
              onClick={() => onCancel && onCancel(appointment.id)}
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6B4423] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {t('appointments.cancelAppointment')}
            </button>
          </div>
        );
      default:
        // Default fallthrough for any unhandled status, treating it as scheduled for availability of actions if needed, 
        // or just null. Since we enforce two statuses, usually null is fine, but if we want to be safe we can return null.
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'completed':
        return <span className={`${base} bg-app-secondary text-app-primary`}>{t('dashboard.completed')}</span>;
      case 'scheduled':
        return <span className={`${base} bg-app-primary text-app-text-light`}>{t('dashboard.scheduled')}</span>;
      default:
        // Even 'pending' should be intercepted by mapAppointmentData, but if it slips through:
        return <span className={`${base} bg-app-primary text-app-text-light`}>{status}</span>;
    }
  };

  return (
    <div className="px-20 py-10 w-full">
      <div className="mb-8 bg-app-primary px-4 py-2">
        <h2 className="text-2xl text-app-accent">{t('dashboard.myAppointments')}</h2>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-app-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayAppointments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 mb-6">You haven't booked any appointments. Start by booking your first appointment!</p>
        </div>
      )}

      {/* Appointments List */}
      {!loading && displayAppointments.length > 0 && (
        <div className="space-y-4 mb-8 px-2">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 text-app-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-app-primary">{appointment.title}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-sm text-gray-600">
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {appointment.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  {getStatusButton(appointment)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={onBookNew}
          className="bg-app-primary hover:bg-app-primary/90 text-app-text-light px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment
        </button>
      </div>
    </div>
  );
}
