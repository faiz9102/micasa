import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/rest/v1';
const normalizedBaseURL = baseURL.replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('micasa_auth');
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch (error) {
  }

  return config;
});

export default apiClient;
