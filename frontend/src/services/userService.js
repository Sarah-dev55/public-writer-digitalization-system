import api from './api';

export async function getUser(userId) {
  const res = await api.get(`/users/${userId}`);
  return res.data;
}

export async function updateUser(userId, payload) {
  const res = await api.put(`/users/${userId}`, payload);
  return res.data;
}
