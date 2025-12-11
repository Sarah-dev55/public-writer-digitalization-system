import api from './api';

/**
 * Client No Work Day Service
 * Handles all client-facing no work day operations
 * Base URL: /api/client/noworkdays
 */

/**
 * Get all no work days
 * @returns {Promise} List of no work days
 */
export async function getAllNoWorkDays() {
    try {
        const res = await api.get('/client/noworkdays');
        return res.data;
    } catch (error) {
        console.error('Error fetching no work days:', error);
        throw error;
    }
}

/**
 * Get no work day by ID
 * @param {string} id - No work day ID
 * @returns {Promise} No work day details
 */
export async function getNoWorkDayById(id) {
    try {
        const res = await api.get(`/client/noworkdays/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching no work day ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new no work day
 * @param {Object} payload - No work day data (date, isRecurring, reason)
 * @returns {Promise} Created no work day
 */
export async function createNoWorkDay(payload) {
    try {
        const res = await api.post('/client/noworkdays', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating no work day:', error);
        throw error;
    }
}

/**
 * Delete a no work day
 * @param {string} id - No work day ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteNoWorkDay(id) {
    try {
        const res = await api.delete(`/client/noworkdays/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting no work day ${id}:`, error);
        throw error;
    }
}
