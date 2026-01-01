import api from './api';

export async function getAppointmentsByDate(date) {
  const res = await api.get(`/api/appointments/date/${date}`);
  return res.data;
}

export async function createAppointment(payload) {
  const res = await api.post('/api/appointments', payload);
  return res.data;
}

export async function updateAppointment(id, payload) {
  const res = await api.put(`/api/appointments/${id}`, payload);
  return res.data;
}

export async function deleteAppointment(id) {
  const res = await api.delete(`/api/appointments/${id}`);
  return res.data;
}

export async function getAllAppointments() {
  const res = await api.get('/api/appointments');
  return res.data;
}
