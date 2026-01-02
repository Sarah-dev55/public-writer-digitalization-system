import api from './api';

// Get a user's information from the server
export async function getUser(userId) {
  try {
    const res = await api.get(`/client/users/${userId}`);
    return res.data;
  } catch (err) {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  }
}

// Update a user's information on the server
export async function updateUser(userId, payload) {
  try {
    const res = await api.put(`/client/users/${userId}`, payload);
    return res.data;
  } catch (err) {
    const res = await api.put(`/users/${userId}`, payload);
    return res.data;
  }
}

// Send a profile picture to the server
export async function uploadProfileImage(userId, file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post(`/client/users/${userId}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// Change the password
export async function changePassword(passwordData) {
  const res = await api.put('/auth/change-password', passwordData);
  return res.data;
}

// Update the profile of the person logged in
export async function updateCurrentUserProfile(payload) {
  const res = await api.put('/client/users/me', payload);
  return res.data;
}
