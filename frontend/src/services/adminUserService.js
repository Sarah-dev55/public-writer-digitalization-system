import api from './api';

// This file helps the admin manage people who use the website

// Get a list of everyone registered
export async function getAllUsers() {
    try {
        const res = await api.get('/admin/users');
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

// Get info about one person
export async function getUserById(id) {
    try {
        const res = await api.get(`/admin/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
    }
}

// Add a new person to the website
export async function createUser(payload) {
    try {
        const res = await api.post('/admin/users', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Change a person's information
export async function updateUser(id, payload) {
    try {
        const res = await api.put(`/admin/users/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
}

// Remove a person from the website
export async function deleteUser(id) {
    try {
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
}
