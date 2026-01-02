import api from './api';

// Talk to the server to log in
export async function login(credentials) {
  const res = await api.post('/auth/signin', credentials);
  return res.data; // expected { success, token, data }
}

// Talk to the server to sign up
export async function signup(payload) {
  const res = await api.post('/auth/signup', payload);
  return res.data;
}

// Talk to the server to log out
export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}
