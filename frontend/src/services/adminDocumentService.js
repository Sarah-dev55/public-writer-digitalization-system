import api from './api';

// This file helps the admin manage papers sent by clients

// Get every paper in the system
export async function getAllDocuments() {
    try {
        const res = await api.get('/admin/documents');
        return res.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}

// Get the papers belonging to a specific user
export async function getDocumentsByUser(userId) {
    try {
        const res = await api.get(`/admin/documents/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching documents for user ${userId}:`, error);
        throw error;
    }
}

// Get the papers that are waiting to be checked
export async function getPendingDocuments() {
    try {
        const res = await api.get('/admin/documents/pending');
        return res.data;
    } catch (error) {
        console.error('Error fetching pending documents:', error);
        throw error;
    }
}

// Get information about one specific paper
export async function getDocumentById(id) {
    try {
        const res = await api.get(`/admin/documents/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        throw error;
    }
}

// Add a new paper to the system
export async function createDocument(payload) {
    try {
        const res = await api.post('/admin/documents', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
}

// Update the information of a paper
export async function updateDocument(id, payload) {
    try {
        const res = await api.put(`/admin/documents/${id}`, payload);
        return res.data;
    } catch (error) {
        console.error(`Error updating document ${id}:`, error);
        throw error;
    }
}

// Delete a paper
export async function deleteDocument(id) {
    try {
        const res = await api.delete(`/admin/documents/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Error deleting document ${id}:`, error);
        throw error;
    }
}

// Upload a new paper file
export async function uploadDocument(formData) {
    try {
        const res = await api.post('/admin/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
}

// Download a paper file to your computer
export async function downloadDocument(id, fileName) {
    try {
        const res = await api.get(`/admin/documents/${id}/download`, {
            responseType: 'blob'
        });

        // Create a blob URL and trigger download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'document');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error(`Error downloading document ${id}:`, error);
        throw error;
    }
}

// Change the status of a paper (like "accepted" or "rejected")
export async function updateDocumentStatus(id, status, statusNotes = '') {
    try {
        const res = await api.put(`/admin/documents/${id}/status`, {
            status,
            statusNotes
        });
        return res.data;
    } catch (error) {
        console.error(`Error updating document status ${id}:`, error);
        throw error;
    }
}
