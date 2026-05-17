import apiClient from './apiClient.js';

export const createInquiry = async (propertyId, payload) => {
  const response = await apiClient.post(`/properties/${propertyId}/inquiries`, payload);
  return response.data;
};

export const listInquiries = async (propertyId) => {
  const response = await apiClient.get(`/properties/${propertyId}/inquiries`);
  return response.data;
};

export const scheduleInquiry = async (propertyId, inquiryId, payload) => {
  const response = await apiClient.patch(
    `/properties/${propertyId}/inquiries/${inquiryId}/contact`,
    payload
  );
  return response.data;
};

export const rescheduleInquiry = async (propertyId, inquiryId, payload) => {
  const response = await apiClient.patch(
    `/properties/${propertyId}/inquiries/${inquiryId}/reschedule-request`,
    payload
  );
  return response.data;
};

export const closeInquiry = async (propertyId, inquiryId) => {
  const response = await apiClient.patch(`/properties/${propertyId}/inquiries/${inquiryId}/close`);
  return response.data;
};
