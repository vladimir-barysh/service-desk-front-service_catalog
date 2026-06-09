import api from './axios';
import { components } from '../types/api';

type TaskResponse = components['schemas']['TaskResponseDTO'];
type TaskCreateRequest = components['schemas']['TaskCreateRequestDTO'];
type TaskUpdateRequest = components['schemas']['TaskUpdateDTO'];
//type TaskStatusUpdateRequest = components['schemas']['TaskStatusUpdateDTO'];

export const taskApi = {
  getAll: (): Promise<TaskResponse[]> => api.get('/api/ordertask').then(res => res.data),
  getById: (id: number): Promise<TaskResponse> => api.get(`/api/ordertask/${id}`).then(res => res.data),
  getByExecutorId: (executorId: number): Promise<TaskResponse[]> =>
    api.get(`/api/ordertask/to-executor?executorId=${executorId}`).then(res => res.data),
  create: (data: TaskCreateRequest): Promise<TaskResponse> =>
    api.post('/api/ordertask', data).then(res => res.data),
  update: (id: number, data: TaskUpdateRequest): Promise<TaskResponse> =>
    api.patch(`/api/ordertask/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/api/ordertask/${id}`).then(() => undefined),
  //updateStatus: (id: number, statusDto: TaskStatusUpdateRequest): Promise<TaskResponse> =>
    //api.patch(`/api/ordertask/${id}/status`, statusDto).then(res => res.data),
};