import api from './api';

export async function getAllNoWorkDays() {
    try {
        const res = await api.get('/client/noworkdays');
        return res.data;
    } catch (error) {
        console.error('Error fetching no work days:', error);
        throw error;
    }
}

export async function getNoWorkDayById(id) {
    try {
        const res = await api.get(`/client/noworkdays/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching no work day ${id}:`, error);
        throw error;
    }
}

export async function createNoWorkDay(payload) {
    try {
        const res = await api.post('/client/noworkdays', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating no work day:', error);
        throw error;
    }
}

export async function deleteNoWorkDay(id) {
    try {
        const res = await api.delete(`/client/noworkdays/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting no work day ${id}:`, error);
        throw error;
    }
}
