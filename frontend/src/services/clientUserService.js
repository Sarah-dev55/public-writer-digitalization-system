import api from './api';

export async function getAllUsers() {
    try {
        const res = await api.get('/client/users');
        return res.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const res = await api.get(`/client/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
    }
}

export async function createUser(payload) {
    try {
        const res = await api.post('/client/users', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function updateUser(id, payload) {
    try {
        const res = await api.put(`/client/users/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const res = await api.delete(`/client/users/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
}

export async function getCaseStatus(userId) {
    try {
        const res = await api.get(`/client/users/case-status/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching case status for user ${userId}:`, error);
        throw error;
    }
}
