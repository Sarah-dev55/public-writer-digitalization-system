import api from './api';

export async function getAvailability() {
  const res = await api.get('/api/availability');
  return res.data;
}

export async function getAllAvailability() {
  const res = await api.get('/api/availability');
  return res.data;
}

export async function addNoWorkDay(payload) {
  const res = await api.post('/api/availability', payload);
  return res.data;
}

export async function removeNoWorkDay(dateStr) {
  const res = await api.delete(`/api/availability/${dateStr}`);
  return res.data;
}
