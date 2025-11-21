import api from './api';

export async function listDocuments() {
  const res = await api.get('/documents');
  return res.data;
}

export async function uploadDocument(formData) {
  const res = await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}
