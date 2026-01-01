import api from './api';

export async function getUser(userId) {
  // Check if it's client or admin context if possible, but for now try /client/users first as it's more common for profile
  try {
    const res = await api.get(`/client/users/${userId}`);
    return res.data;
  } catch (err) {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  }
}

export async function updateUser(userId, payload) {
  try {
    const res = await api.put(`/client/users/${userId}`, payload);
    return res.data;
  } catch (err) {
    const res = await api.put(`/users/${userId}`, payload);
    return res.data;
  }
}
