import api from './api';

/**
 * Admin Appointment Service
 * Handles all admin-facing appointment operations
 * Base URL: /api/admin/appointments
 */

/**
 * Get all appointments
 * @returns {Promise} List of all appointments
 */
export async function getAllAppointments() {
    try {
        const res = await api.get('/admin/appointments');
        return res.data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Get appointments by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} List of appointments for the specified date
 */
export async function getAppointmentsByDate(date) {
    try {
        const res = await api.get(`/admin/appointments/date/${date}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching appointments for date ${date}:`, error);
        throw error;
    }
}

/**
 * Get appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Promise} Appointment details
 */
export async function getAppointmentById(id) {
    try {
        const res = await api.get(`/admin/appointments/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new appointment
 * @param {Object} payload - Appointment data (date, timeSlot, notes, appointmentType, userId, status)
 * @returns {Promise} Created appointment
 */
export async function createAppointment(payload) {
    try {
        const res = await api.post('/admin/appointments', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

/**
 * Update an appointment
 * @param {string} id - Appointment ID
 * @param {Object} payload - Updated appointment data
 * @returns {Promise} Updated appointment
 */
export async function updateAppointment(id, payload) {
    try {
        const res = await api.put(`/admin/appointments/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating appointment ${id}:`, error);
        throw error;
    }
}

/**
 * Delete an appointment
 * @param {string} id - Appointment ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteAppointment(id) {
    try {
        const res = await api.delete(`/admin/appointments/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting appointment ${id}:`, error);
        throw error;
    }
}
