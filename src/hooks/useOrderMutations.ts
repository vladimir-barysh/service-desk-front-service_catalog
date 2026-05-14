import { createCRUDMutation } from './createCRUDMutation';
import { orderApi } from '../api/order';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type OrderResponse = components['schemas']['OrderResponseDTO'];
type OrderCreateRequest = components['schemas']['OrderCreateRequestDTO'];
type OrderUpdateRequest = components['schemas']['OrderUpdateDTO'];

// Получение всех заявок
export const useOrders = () => useQuery<OrderResponse[]>({
  queryKey: ['orders'],
  queryFn: orderApi.getAll,
});

// Создание заявки
export const useCreateOrder = createCRUDMutation<OrderCreateRequest, OrderResponse>({
  type: 'create',
  mutationFn: orderApi.create,
  queryKey: ['orders'],
  addToCache: (old, newOrder) => old ? [newOrder, ...old] : [newOrder],
  successMessage: 'Заказ успешно создан',
  errorMessage: 'Не удалось создать заказ',
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
  successMessage: 'Заказ обновлён',
  errorMessage: 'Не удалось обновить заказ',
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
  successMessage: 'Заказ удалён',
  errorMessage: 'Не удалось удалить заказ',
});