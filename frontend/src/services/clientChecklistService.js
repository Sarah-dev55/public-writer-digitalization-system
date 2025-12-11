import api from './api';

/**
 * Client Checklist Service
 * Handles all client-facing checklist operations
 * Base URL: /api/client/checklists
 */

/**
 * Get all checklists
 * @returns {Promise} List of checklists
 */
export async function getAllChecklists() {
    try {
        const res = await api.get('/client/checklists');
        return res.data;
    } catch (error) {
        console.error('Error fetching checklists:', error);
        throw error;
    }
}

/**
 * Get checklist by user ID
 * @param {string} userId - User ID
 * @returns {Promise} Checklist for the specified user
 */
export async function getChecklistByUser(userId) {
    try {
        const res = await api.get(`/client/checklists/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching checklist for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Get checklist by ID
 * @param {string} id - Checklist ID
 * @returns {Promise} Checklist details
 */
export async function getChecklistById(id) {
    try {
        const res = await api.get(`/client/checklists/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching checklist ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new checklist
 * @param {Object} payload - Checklist data (userId, title, items)
 * @returns {Promise} Created checklist
 */
export async function createChecklist(payload) {
    try {
        const res = await api.post('/client/checklists', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating checklist:', error);
        throw error;
    }
}

/**
 * Update a checklist
 * @param {string} id - Checklist ID
 * @param {Object} payload - Updated checklist data
 * @returns {Promise} Updated checklist
 */
export async function updateChecklist(id, payload) {
    try {
        const res = await api.put(`/client/checklists/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating checklist ${id}:`, error);
        throw error;
    }
}

/**
 * Update a checklist item
 * @param {string} checklistId - Checklist ID
 * @param {string} itemId - Item ID
 * @param {Object} payload - Updated item data (isCompleted, etc.)
 * @returns {Promise} Updated checklist
 */
export async function updateChecklistItem(checklistId, itemId, payload) {
    try {
        const res = await api.patch(`/client/checklists/${checklistId}/items/${itemId}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating checklist item ${itemId}:`, error);
        throw error;
    }
}

/**
 * Delete a checklist
 * @param {string} id - Checklist ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteChecklist(id) {
    try {
        const res = await api.delete(`/client/checklists/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting checklist ${id}:`, error);
        throw error;
    }
}
