import apiClient from './apiClient.js';

export const listProperties = async (filters = {}) => {
  const response = await apiClient.get('/properties', { params: filters });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await apiClient.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (payload) => {
  const response = await apiClient.post('/properties', payload);
  return response.data;
};

export const updateProperty = async (id, payload) => {
  const response = await apiClient.patch(`/properties/${id}`, payload);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await apiClient.delete(`/properties/${id}`);
  return response.data;
};
