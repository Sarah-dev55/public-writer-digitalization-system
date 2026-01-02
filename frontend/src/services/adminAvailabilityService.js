import api from './api';

// This file helps the admin set when they are free for meetings

// Get all the stored schedules
export async function getAllAvailability() {
    try {
        const res = await api.get('/admin/availability');
        return res.data;
    } catch (error) {
        console.error('Error fetching availability:', error);
        throw error;
    }
}

// Get info about a specific schedule
export async function getAvailabilityById(id) {
    try {
        const res = await api.get(`/admin/availability/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching availability ${id}:`, error);
        throw error;
    }
}

// Save a new schedule
export async function createAvailability(payload) {
    try {
        const res = await api.post('/admin/availability', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating availability:', error);
        throw error;
    }
}

// Change an existing schedule
export async function updateAvailability(id, payload) {
    try {
        const res = await api.put(`/admin/availability/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating availability ${id}:`, error);
        throw error;
    }
}

// Delete a schedule
export async function deleteAvailability(id) {
    try {
        const res = await api.delete(`/admin/availability/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting availability ${id}:`, error);
        throw error;
    }
}
