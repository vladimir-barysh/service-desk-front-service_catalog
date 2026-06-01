import api from './axios';
import { components } from '../types/api';

type ServiceResponse = components['schemas']['ServResponseDTO'];

export const serviceApi = {
  getAll: (): Promise<ServiceResponse[]> => api.get('/api/service').then(res => res.data),
  getById: (id: number): Promise<ServiceResponse> => api.get(`/api/service/${id}`).then(res => res.data)
};