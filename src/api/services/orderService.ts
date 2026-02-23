import api from '../axios';
import { OrderCreateDTO, OrderUpdateDTO } from '../dtos';

export const getOrders = async () => {
  const { data } = await api.get('/api/order');
  return data;
}

export const createOrder = async (payload: OrderCreateDTO) => {
  const response = await api.post('/api/order', payload);
  return response.data;
}

export const updateOrder = async (id: number | undefined, payload: OrderUpdateDTO) => {
  const response = await api.put(`/api/order/${id}`, payload);
  return response.data;
}

export const updateOrderStatus = async (id: number, statusId: number) => {
  const { data } = await api.patch(`/api/order/${id}/status`, { idOrderState: statusId });
  return data;
};