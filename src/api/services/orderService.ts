import api from '../axios';
import { OrderCreateDTO, OrderUpdateDTO } from '../dtos';

export const getOrders = async () => {
  const { data } = await api.get('/api/order');
  return data;
}

export const createOrder = async (data: FormData) => {
  const response = await api.post('/api/order', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export const updateOrder = async (id: number | undefined, payload: OrderUpdateDTO) => {
  const response = await api.put(`/api/order/${id}`, payload);
  return response.data;
}