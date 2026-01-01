import api from './api';

/**
 * Client Appointment Service
 * Handles all client-facing appointment operations
 * Base URL: /api/client/appointments
 */

/**
 * Get all appointments for a specific user
 * @param {string} userId - User ID
 * @returns {Promise} List of user's appointments
 */
export async function getUserAppointments(userId) {
    try {
        const res = await api.get(`/client/appointments/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        throw error;
    }
}

/**
 * Get all appointments
 * @returns {Promise} List of appointments
 */
export async function getAllAppointments() {
    try {
        const res = await api.get('/client/appointments');
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
        const res = await api.get(`/client/appointments/date/${date}`);
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
        const res = await api.get(`/client/appointments/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new appointment
 * @param {Object} payload - Appointment data (date, timeSlot, notes, appointmentType, userId)
 * @returns {Promise} Created appointment
 */
export async function createAppointment(payload) {
    try {
        const res = await api.post('/client/appointments', payload);
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
        const res = await api.put(`/client/appointments/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating appointment ${id}:`, error);
        throw error;
    }
}

/**
 * Delete an appointment with ownership validation
 * @param {string} id - Appointment ID
 * @param {string} userId - User ID for ownership validation
 * @returns {Promise} Deletion confirmation
 */
export async function deleteAppointment(id, userId) {
    try {
        const res = await api.delete(`/client/appointments/user/${id}`, {
            data: { userId }
        });
        return res.data;
    } catch (error) {
        console.error(`Error deleting appointment ${id}:`, error);
        throw error;
    }
}
