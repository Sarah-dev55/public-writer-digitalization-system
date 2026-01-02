import api from './api';

export async function getAllChecklists() {
    try {
        const res = await api.get('/client/checklists');
        return res.data;
    } catch (error) {
        console.error('Error fetching checklists:', error);
        throw error;
    }
}

export async function getChecklistByUser(userId) {
    try {
        const res = await api.get(`/client/checklists/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching checklist for user ${userId}:`, error);
        throw error;
    }
}

export async function getChecklistById(id) {
    try {
        const res = await api.get(`/client/checklists/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching checklist ${id}:`, error);
        throw error;
    }
}

export async function createChecklist(payload) {
    try {
        const res = await api.post('/client/checklists', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating checklist:', error);
        throw error;
    }
}

export async function updateChecklist(id, payload) {
    try {
        const res = await api.put(`/client/checklists/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating checklist ${id}:`, error);
        throw error;
    }
}

export async function updateChecklistItem(checklistId, itemId, payload) {
    try {
        const res = await api.patch(`/client/checklists/${checklistId}/items/${itemId}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating checklist item ${itemId}:`, error);
        throw error;
    }
}

export async function deleteChecklist(id) {
    try {
        const res = await api.delete(`/client/checklists/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting checklist ${id}:`, error);
        throw error;
    }
}
