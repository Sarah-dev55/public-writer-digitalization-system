import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Services from '../pages/Services';
import ClientOverview from '../pages/client/Overview';
import Appointments from '../pages/client/Appointments';
import ClientDocuments from '../pages/client/Documents';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminAppointments from '../pages/admin/Appointments';
import AdminAvailability from '../pages/admin/Availability';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        <Route path="/client/overview" element={<ClientOverview />} />
        <Route path="/client/appointments" element={<Appointments />} />
        <Route path="/client/documents" element={<ClientDocuments />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/availability" element={<AdminAvailability />} />
      </Routes>
    </BrowserRouter>
  );
}
