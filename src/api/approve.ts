import api from './axios';
import { components } from '../types/api';

type ApproveResponse = components['schemas']['ApproveResponseDTO'];
type ApproveCreateRequest = components['schemas']['ApproveCreateRequestDTO'];

export const approveApi = {
    getByOrderId: (orderId: number): Promise<ApproveResponse[]> =>
        api.get(`/api/approve?orderId=${orderId}`).then(res => res.data),
    getById: (id: number): Promise<ApproveResponse> => api.get(`/api/approve/${id}`).then(res => res.data),
    create: (data: ApproveCreateRequest): Promise<ApproveResponse> =>
        api.post('/api/approve', data).then(res => res.data),
};