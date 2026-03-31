import api from '../axios';
import { OrderState } from '../models';

export const getOrderStates = async (): Promise<OrderState[]> => {
  const { data } = await api.get('/api/orderstate');
  return data;
};