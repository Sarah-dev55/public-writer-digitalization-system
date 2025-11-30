import api from './api';

export async function getChecklistByUser(userId) {
  const res = await api.get(`/api/checklists/user/${userId}`);
  return res.data;
}

export async function createChecklist(payload) {
  const res = await api.post('/api/checklists', payload);
  return res.data;
}

export async function updateChecklist(id, payload) {
  const res = await api.put(`/api/checklists/${id}`, payload);
  return res.data;
}

export async function updateChecklistItem(checklistId, itemId, payload) {
  const res = await api.put(`/api/checklists/${checklistId}/items/${itemId}`, payload);
  return res.data;
}
