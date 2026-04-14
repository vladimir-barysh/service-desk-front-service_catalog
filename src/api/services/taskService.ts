import api from '../axios';
import { TaskCreateDTO, TaskUpdateDTO } from '../dtos';

export const getTasks = async () => {
  const { data } = await api.get('/api/ordertask');
  return data;
}

export const createTask = async (data: TaskCreateDTO) => {
  const response = await api.post('/api/ordertask', data);
  return response.data;
}

export const updateTask = async (id: number | undefined, payload: TaskUpdateDTO) => {
  const response = await api.patch(`/api/ordertask/${id}`, payload);
  return response.data;
}
