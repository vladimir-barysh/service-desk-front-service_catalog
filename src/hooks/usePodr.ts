import { podrApi } from '../api/podr';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type PodrResponse = components['schemas']['PodrResponseDTO'];

interface UsePodrsProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех сервисов
export const usePodrs = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UsePodrsProps = {}) => 
  useQuery<PodrResponse[]>({
  queryKey: ['services'],
  queryFn: podrApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});