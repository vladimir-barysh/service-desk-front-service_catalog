import { orderPriorityApi } from '../api/orderpriority';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type OrderPriorityResponse = components['schemas']['OrderPriorityResponseDTO'];

interface UseOrderPrioritiesProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех сервисов
export const useOrderPriorities = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UseOrderPrioritiesProps = {}) => 
  useQuery<OrderPriorityResponse[]>({
  queryKey: ['orderpriorities'],
  queryFn: orderPriorityApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});