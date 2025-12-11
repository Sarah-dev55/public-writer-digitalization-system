import api from './api';

/**
 * Client User Service
 * Handles all client-facing user operations
 * Base URL: /api/client/users
 */

/**
 * Get all users
 * @returns {Promise} List of users
 */
export async function getAllUsers() {
    try {
        const res = await api.get('/client/users');
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise} User details
 */
export async function getUserById(id) {
    try {
        const res = await api.get(`/client/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
    }
}

/**
 * Create a new user
 * @param {Object} payload - User data (fullName, email, phone, checklistId)
 * @returns {Promise} Created user
 */
export async function createUser(payload) {
    try {
        const res = await api.post('/client/users', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} payload - Updated user data
 * @returns {Promise} Updated user
 */
export async function updateUser(id, payload) {
    try {
        const res = await api.put(`/client/users/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise} Deletion confirmation
 */
export async function deleteUser(id) {
    try {
        const res = await api.delete(`/client/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
}
