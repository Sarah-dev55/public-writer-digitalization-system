import React from 'react';

export default function DashboardStats({ pendingCount = 0, appointmentsCount = 0, clientsCount = 0 }) {
  const stats = [
    {
      label: 'Pending Documents',
      value: pendingCount,
      color: 'bg-app-primary',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Total Appointments',
      value: appointmentsCount,
      color: 'bg-app-secondary',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Active Clients',
      value: clientsCount,
      color: 'bg-app-secondary',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-6 shadow-md border border-app-primary/10 flex items-center gap-4 hover:shadow-lg transition-shadow"
        >
          <div className={`${stat.color} text-white p-3 rounded-lg`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-app-primary">{stat.value}</p>
            <p className="text-sm text-app-primary/70">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
