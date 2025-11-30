import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ClientOverview from '../pages/client/Overview';
import ClientAppointments from '../pages/client/Appointments';
import ClientDocuments from '../pages/client/Documents';
import AdminDashboard from '../pages/admin/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/client/overview" element={<ClientOverview />} />
        <Route path="/client/appointments" element={<ClientAppointments />} />
        <Route path="/client/documents" element={<ClientDocuments />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
