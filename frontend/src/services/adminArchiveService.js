import api from './api';

// Backend: GET /api/admin/archives/search
// Supports params: query, caseType, status, startDate, endDate
export async function searchArchives(params = {}) {
  const res = await api.get('/admin/archives/search', { params });
  return res.data;
}

// Backend: GET /api/admin/archives/client/:clientId
export async function getClientArchive(clientId) {
  const res = await api.get(`/admin/archives/client/${clientId}`);
  return res.data;
}

// Backend: GET /api/admin/archives/client/:clientId/history
export async function getClientArchiveHistory(clientId) {
  const res = await api.get(`/admin/archives/client/${clientId}/history`);
  return res.data;
}
