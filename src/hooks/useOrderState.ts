import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

type OrderStateResponse = components['schemas']['OrderStateResponseDTO'];

export const useOrderStates = () => useQuery<OrderStateResponse[]>({
  queryKey: ['orderStates'],
  queryFn: () => api.get('/api/orderstate').then(res => res.data),
  staleTime: Infinity,  // данные не устаревают
});