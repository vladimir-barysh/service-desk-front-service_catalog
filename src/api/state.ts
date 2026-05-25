import api from './axios';
import { components } from '../types/api';

type StateResponse = components['schemas']['StateResponseDTO'];
//type TaskCreateRequest = components['schemas']['TaskCreateRequestDTO'];
//type TaskUpdateRequest = components['schemas']['TaskUpdateDTO'];
//type TaskStatusUpdateRequest = components['schemas']['TaskStatusUpdateDTO'];

export const stateApi = {
  getAll: (): Promise<StateResponse[]> => api.get('/api/orderstate').then(res => res.data),
  getById: (id: number): Promise<StateResponse> => api.get(`/api/orderstate/${id}`).then(res => res.data),
  //create: (data: TaskCreateRequest): Promise<TaskResponse> =>
    //api.post('/api/ordertask', data).then(res => res.data),
  //update: (id: number, data: TaskUpdateRequest): Promise<TaskResponse> =>
    //api.patch(`/api/ordertask/${id}`, data).then(res => res.data),
  //delete: (id: number): Promise<void> => api.delete(`/api/ordertask/${id}`).then(() => undefined),
  //updateStatus: (id: number, statusDto: TaskStatusUpdateRequest): Promise<TaskResponse> =>
    //api.patch(`/api/ordertask/${id}/status`, statusDto).then(res => res.data),
};