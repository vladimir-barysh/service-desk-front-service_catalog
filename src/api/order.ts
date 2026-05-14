import api from './axios';
import { components } from '../types/api';

type OrderResponse = components['schemas']['OrderResponseDTO'];
type OrderCreateRequest = components['schemas']['OrderCreateRequestDTO'];
type OrderUpdateRequest = components['schemas']['OrderUpdateDTO'];
type OrderStatusUpdateRequest = components['schemas']['OrderStatusUpdateDTO'];

export const orderApi = {
  getAll: (): Promise<OrderResponse[]> => api.get('/api/order').then(res => res.data),
  getById: (id: number): Promise<OrderResponse> => api.get(`/api/order/${id}`).then(res => res.data),
  create: (data: OrderCreateRequest): Promise<OrderResponse> =>
    api.post('/api/order', data).then(res => res.data),
  update: (id: number, data: OrderUpdateRequest): Promise<OrderResponse> =>
    api.patch(`/api/order/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/api/order/${id}`).then(() => undefined),
  updateStatus: (id: number, statusDto: OrderStatusUpdateRequest): Promise<OrderResponse> =>
    api.patch(`/api/order/${id}/status`, statusDto).then(res => res.data),
};