import api from './api';

export async function login(credentials) {
  const res = await api.post('/auth/signin', credentials);
  return res.data; // expected { success, token, data }
}

export async function signup(payload) {
  const res = await api.post('/auth/signup', payload);
  return res.data;
}

export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}
