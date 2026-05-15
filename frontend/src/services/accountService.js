import apiClient from './apiClient.js';

export const createAccount = async (payload) => {
  const response = await apiClient.post('/account', payload);
  return response.data;
};

export const listAccounts = async () => {
  const response = await apiClient.get('/account');
  return response.data;
};

export const deactivateAccount = async (id) => {
  const response = await apiClient.delete(`/account/${id}`);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await apiClient.delete('/account');
  return response.data;
};

export const promoteUser = async (payload) => {
  const response = await apiClient.post('/account/promote', payload);
  return response.data;
};
