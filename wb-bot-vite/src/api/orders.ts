import { api } from './client';

export const getAdditionalServices = async () => {
  try {
    const response = await api.getAdditionalServices();
    return response;
  } catch (error) {
    console.error('Error fetching additional services:', error);
    throw error;
  }
}; 