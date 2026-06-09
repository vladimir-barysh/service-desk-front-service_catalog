import api from './axios';
import { components } from '../types/api';

type OrderPriorityResponse = components['schemas']['OrderPriorityResponseDTO'];

export const orderPriorityApi = {
    getAll: (): Promise<OrderPriorityResponse[]> => api.get('/api/orderpriority').then(res => res.data),
    getById: (id: number): Promise<OrderPriorityResponse> => api.get(`/api/orderpriority/${id}`).then(res => res.data)
};