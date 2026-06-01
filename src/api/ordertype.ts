import api from './axios';
import { components } from '../types/api';

type OrderTypeResponse = components['schemas']['OrderTypeResponseDTO'];

export const orderTypeApi = {
    getAll: (): Promise<OrderTypeResponse[]> => api.get('/api/ordertype').then(res => res.data),
    getById: (id: number): Promise<OrderTypeResponse> => api.get(`/api/ordertype/${id}`).then(res => res.data)
};