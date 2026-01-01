import api from './api';

export async function listDocumentsByUser(userId) {
    const res = await api.get(`/client/documents/user/${userId}`);
    return res.data;
}

export async function createDocument(payload) {
    const res = await api.post('/client/documents', payload);
    return res.data;
}

export async function uploadDocument(formData) {
    // Upload with multipart/form-data
    const res = await api.post('/client/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
}

export async function deleteDocument(id, userId) {
    const res = await api.delete(`/client/documents/${id}`, {
        data: { userId }
    });
    return res.data;
}

export async function listAllDocuments() {
    const res = await api.get('/admin/documents');
    return res.data;
}

export async function listPendingDocuments() {
    const res = await api.get('/admin/documents/pending');
    return res.data;
}

export async function updateDocument(id, payload) {
    const res = await api.put(`/admin/documents/${id}`, payload);
    return res.data;
}
