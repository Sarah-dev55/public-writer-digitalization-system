import React from 'react';

export default function AppointmentsList({ appointments = [], onBookNew, onReschedule, onCancel }) {
  // Default sample data if none provided
  const defaultAppointments = [
    {
      id: 1,
      title: 'Initial Consultation',
      date: '2025-11-22',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Document Review',
      date: '2025-11-29',
      time: '2:00 PM',
      duration: '45 minutes',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Interview Preparation',
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
          <button className="px-4 py-2 bg-[#A3B18A] text-[#3A4D42] rounded-lg text-sm font-semibold">
            Completed
          </button>
        );
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              disabled
              className="px-4 py-2 bg-[#DDA15E] bg-opacity-40 text-[#3A4D42] rounded-lg text-sm font-semibold cursor-not-allowed opacity-60"
            >
              Reschedule
            </button>
            <button
              disabled
              className="px-4 py-2 bg-[#BC6C25] bg-opacity-40 text-[#3A4D42] rounded-lg text-sm font-semibold cursor-not-allowed opacity-60"
            >
              Cancel
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
              Reschedule
            </button>
            <button
              onClick={() => onCancel && onCancel(appointment.id)}
              className="px-4 py-2 bg-[#BC6C25] hover:bg-[#8B5A2B] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center px-2 py-1 rounded-full font-semibold text-[11px]';
    switch (status) {
      case 'completed':
        return <span className={`${base} bg-[#A3B18A] text-[#3A4D42]`}>Completed</span>;
      case 'pending':
        return <span className={`${base} bg-[#DDA15E] text-white`}>Pending</span>;
      case 'scheduled':
        return <span className={`${base} bg-[#588157] text-white`}>Scheduled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  return (
    <div className=" px-20 py-10 bg-[#3A4D42] w-full " >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-[#A3B18A]">My Appointments</h2>
        <button
          onClick={onBookNew}
          className="bg-[#588157] hover:bg-[#4a6a56] text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Book New Appointment
        </button>
      </div>
      
      <div className="space-y-4">
        {displayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-[#F3ECDC] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-[#2d4a3e]">{appointment.title}</h3>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-gray-700">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {appointment.date} at {appointment.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration: {appointment.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusButton(appointment)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}