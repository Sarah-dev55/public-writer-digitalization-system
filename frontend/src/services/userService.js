import api from './api';

export async function getUser(userId) {
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

export async function uploadProfileImage(userId, file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post(`/client/users/${userId}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function changePassword(passwordData) {
  const res = await api.put('/auth/change-password', passwordData);
  return res.data;
}

export async function updateCurrentUserProfile(payload) {
  const res = await api.put('/client/users/me', payload);
  return res.data;
}
