import { orderTypeApi } from '../api/ordertype';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type OrderTypeResponse = components['schemas']['OrderTypeResponseDTO'];

interface UseOrderTypesProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех сервисов
export const useOrderTypes = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UseOrderTypesProps = {}) => 
  useQuery<OrderTypeResponse[]>({
  queryKey: ['ordertypes'],
  queryFn: orderTypeApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});