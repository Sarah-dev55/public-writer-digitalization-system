import api from './api';

/**
 * Admin Availability Service
 * Handles all admin-facing availability operations
 * Base URL: /api/admin/availability
 */

/**
 * Get all availability records
 * @returns {Promise} List of availability records
 */
export async function getAllAvailability() {
    try {
        const res = await api.get('/admin/availability');
        return res.data;
    } catch (error) {
        console.error('Error fetching availability:', error);
        throw error;
    }
}

/**
 * Get availability by ID
 * @param {string} id - Availability ID
 * @returns {Promise} Availability details
 */
export async function getAvailabilityById(id) {
    try {
        const res = await api.get(`/admin/availability/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching availability ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new availability record
 * @param {Object} payload - Availability data (date, timeSlots, etc.)
 * @returns {Promise} Created availability record
 */
export async function createAvailability(payload) {
    try {
        const res = await api.post('/admin/availability', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating availability:', error);
        throw error;
    }
}

/**
 * Update an availability record
 * @param {string} id - Availability ID
 * @param {Object} payload - Updated availability data
 * @returns {Promise} Updated availability record
 */
export async function updateAvailability(id, payload) {
    try {
        const res = await api.put(`/admin/availability/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating availability ${id}:`, error);
        throw error;
    }
}

/**
 * Delete an availability record
 * @param {string} id - Availability ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteAvailability(id) {
    try {
        const res = await api.delete(`/admin/availability/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting availability ${id}:`, error);
        throw error;
    }
}
