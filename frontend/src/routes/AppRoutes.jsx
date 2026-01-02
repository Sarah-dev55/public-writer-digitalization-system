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
import AdminDocuments from '../pages/admin/Documents';
import AdminClients from '../pages/admin/Clients';
import AdminSettings from '../pages/admin/Settings';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/services" element={<Services />} />
        
        {/* Client Routes - Protected */}
        <Route path="/client/overview" element={<PrivateRoute><ClientOverview /></PrivateRoute>} />
        <Route path="/client/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        <Route path="/client/documents" element={<PrivateRoute><ClientDocuments /></PrivateRoute>} />

        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
        <Route path="/admin/availability" element={<AdminRoute><AdminAvailability /></AdminRoute>} />
        <Route path="/admin/documents" element={<AdminRoute><AdminDocuments /></AdminRoute>} />
        <Route path="/admin/clients" element={<AdminRoute><AdminClients /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
