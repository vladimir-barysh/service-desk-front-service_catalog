import api from './axios';
import { components } from '../types/api';

type UserResponse = components['schemas']['UserResponseDTO'];
//type UserCreateRequest = components['schemas']['UserCreateRequestDTO'];
//type UserUpdateRequest = components['schemas']['UserUpdateDTO'];
//type UserStatusUpdateRequest = components['schemas']['UserStatusUpdateDTO'];

export const userApi = {
  getAll: (): Promise<UserResponse[]> => api.get('/api/user').then(res => res.data),
  getById: (id: number): Promise<UserResponse> => api.get(`/api/user/${id}`).then(res => res.data),
  //create: (data: UserCreateRequest): Promise<UserResponse> =>
    //api.post('/api/ordertask', data).then(res => res.data),
  //update: (id: number, data: UserUpdateRequest): Promise<UserResponse> =>
    //api.patch(`/api/ordertask/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/api/ordertask/${id}`).then(() => undefined),
  //updateStatus: (id: number, statusDto: UserStatusUpdateRequest): Promise<UserResponse> =>
    //api.patch(`/api/ordertask/${id}/status`, statusDto).then(res => res.data),
};