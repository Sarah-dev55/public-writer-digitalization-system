import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AppointmentsList({ appointments = [], onBookNew, onReschedule, onCancel }) {
  const { t } = useTranslation();
  
  // Default sample data if none provided
  const defaultAppointments = [
    {
      id: 1,
      title: t('dashboard.initialConsultation'),
      date: '2025-11-22',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'scheduled',
    },
    {
      id: 2,
      title: t('dashboard.documentReview'),
      date: '2025-11-29',
      time: '2:00 PM',
      duration: '45 minutes',
      status: 'pending',
    },
    {
      id: 3,
      title: t('dashboard.interviewPreparation'),
      date: '2025-11-15',
      time: '11:00 AM',
      duration: '1 hour',
      status: 'completed',
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : defaultAppointments;

  const getStatusButton = (appointment) => {
    switch (appointment.status) {
      case 'completed':
        return (
          <button className="px-4 py-2 bg-app-secondary text-app-primary rounded-lg text-sm font-semibold">
            {t('common.view')}
          </button>
        );
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onReschedule && onReschedule(appointment.id)}
              className="px-4 py-2 bg-[#DDA15E] hover:bg-[#BC6C25] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {t('common.view')}
            </button>
            <button
              onClick={() => onCancel && onCancel(appointment.id)}
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6B4423] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {t('appointments.cancelAppointment')}
            </button>
          </div>
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
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'completed':
        return <span className={`${base} bg-app-secondary text-app-primary`}>{t('dashboard.completed')}</span>;
      case 'pending':
        return <span className={`${base} bg-[#DDA15E] text-white`}>{t('dashboard.pending')}</span>;
      case 'scheduled':
        return <span className={`${base} bg-app-primary text-app-text-light`}>{t('dashboard.scheduled')}</span>;
      default:
        return <span className={`${base} bg-gray-400 text-white`}>{status}</span>;
    }
  };

  return (
    <div className="px-20 py-10 w-full">
      <div className="mb-8 bg-app-primary px-4 py-2">
        <h2 className="text-2xl text-app-accent">{t('dashboard.myAppointments')}</h2>
      </div>
      
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