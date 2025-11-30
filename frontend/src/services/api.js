import axios from 'axios';

const api = axios.create({
  // Default to the backend dev server API. You can override with VITE_API_BASE_URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
