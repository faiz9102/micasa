import apiClient from './apiClient.js';

export const login = async (role, payload) => {
  const response = await apiClient.post(`/${role}/login`, payload);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/logout');
  return response.data;
};

export const refresh = async () => {
  const response = await apiClient.post('/refresh');
  return response.data;
};
