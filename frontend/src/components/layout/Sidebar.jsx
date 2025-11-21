import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r p-4">
      <nav className="space-y-2">
        <a className="block text-gray-700" href="/client/overview">Overview</a>
        <a className="block text-gray-700" href="/client/appointments">Appointments</a>
        <a className="block text-gray-700" href="/client/documents">Documents</a>
      </nav>
    </aside>
  );
}
