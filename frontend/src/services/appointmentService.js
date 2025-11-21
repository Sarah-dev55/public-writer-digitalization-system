import api from './api';

export async function getAppointments() {
  const res = await api.get('/appointments');
  return res.data;
}

export async function createAppointment(payload) {
  const res = await api.post('/appointments', payload);
  return res.data;
}
