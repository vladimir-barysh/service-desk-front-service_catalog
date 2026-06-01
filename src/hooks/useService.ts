import { serviceApi } from '../api/service';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type ServiceResponse = components['schemas']['ServResponseDTO'];

interface UseServicesProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех сервисов
export const useServices = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UseServicesProps = {}) => 
  useQuery<ServiceResponse[]>({
  queryKey: ['services'],
  queryFn: serviceApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});