import { createCRUDMutation } from './createCRUDMutation';
import { orderApi } from '../api/order';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type OrderResponse = components['schemas']['OrderResponseDTO'];
type OrderCreateRequest = components['schemas']['OrderCreateRequestDTO'];
type OrderUpdateRequest = components['schemas']['OrderUpdateDTO'];

interface UseOrdersProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех заявок
export const useOrders = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true
}: UseOrdersProps = {}) =>
  useQuery<OrderResponse[]>({
    queryKey: ['orders'],
    queryFn: orderApi.getAll,
    enabled,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus
  });

// Получение всех заявок для конкретного инициатора
export const useOrdersByInitiator = (
  initiatorId: number,
  {
    enabled = !!initiatorId,
    staleTime = 5 * 60 * 1000,
    refetchOnMount = 'always',
    refetchOnWindowFocus = true
  }: UseOrdersProps = {}
) => 
  useQuery<OrderResponse[]>({
    queryKey: ['currInitiatorOrders', 'initiator', initiatorId],
    queryFn: () => orderApi.getByInitiatorId(initiatorId),
    enabled,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus
  });

// Создание заявки
export const useCreateOrder = createCRUDMutation<OrderCreateRequest, OrderResponse>({
  type: 'create',
  mutationFn: orderApi.create,
  queryKey: ['orders'],
  addToCache: (old, newOrder) => old ? [newOrder, ...old] : [newOrder],
  successMessage: 'Заявка успешно создана',
  errorMessage: 'Не удалось создать заявку',
});

// Обновление заявки
export const useUpdateOrder = createCRUDMutation<
  { id: number; data: OrderUpdateRequest },
  OrderResponse
>({
  type: 'update',
  mutationFn: ({ id, data }) => orderApi.update(id, data),
  queryKey: ['orders'],
  getEntityId: (vars) => vars.id,
  idField: 'idOrder',
  successMessage: 'Заявка обновлёна',
  errorMessage: 'Не удалось обновить заявку',
});

// Обновление статуса (отдельный эндпоинт)
export const useUpdateOrderStatus = createCRUDMutation<
  { id: number; statusId: number },
  OrderResponse
>({
  type: 'update',
  mutationFn: ({ id, statusId }) => orderApi.updateStatus(id, { idOrderState: statusId }),
  queryKey: ['orders'],
  getEntityId: (vars) => vars.id,
  idField: 'idOrder',
  successMessage: 'Статус обновлён',
});

// Удаление заявки
export const useDeleteOrder = createCRUDMutation<number, void>({
  type: 'delete',
  mutationFn: orderApi.delete,
  queryKey: ['orders'],
  getEntityId: (id) => id,
  idField: 'idOrder',
  successMessage: 'Заявка удалёна',
  errorMessage: 'Не удалось удалить заявку',
});