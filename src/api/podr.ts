import api from './axios';
import { components } from '../types/api';

type PodrResponse = components['schemas']['PodrResponseDTO'];

export const podrApi = {
  getAll: (): Promise<PodrResponse[]> => api.get('/api/podr').then(res => res.data),
  getById: (id: number): Promise<PodrResponse> => api.get(`/api/podr/${id}`).then(res => res.data)
};