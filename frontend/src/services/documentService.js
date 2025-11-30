import api from './api';

export async function listDocumentsByUser(userId) {
  const res = await api.get(`/api/documents/user/${userId}`);
  return res.data;
}

export async function createDocument(payload) {
  const res = await api.post('/api/documents', payload);
  return res.data;
}

export async function uploadDocument(formData) {
  // Note: actual upload endpoint should be configured to accept multipart/form-data (multer)
  const res = await api.post('/api/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function listAllDocuments() {
  const res = await api.get('/api/documents');
  return res.data;
}

export async function listPendingDocuments() {
  const res = await api.get('/api/documents/pending');
  return res.data;
}

export async function updateDocument(id, payload) {
  const res = await api.put(`/api/documents/${id}`, payload);
  return res.data;
}
