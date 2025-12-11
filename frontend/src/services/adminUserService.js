import api from './api';

/**
 * Admin User Service
 * Handles all admin-facing user operations
 * Base URL: /api/admin/users
 */

/**
 * Get all users
 * @returns {Promise} List of all users
 */
export async function getAllUsers() {
    try {
        const res = await api.get('/admin/users');
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
        const res = await api.get(`/admin/users/${id}`);
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
        const res = await api.post('/admin/users', payload);
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
        const res = await api.put(`/admin/users/${id}`, payload);
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
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
}
