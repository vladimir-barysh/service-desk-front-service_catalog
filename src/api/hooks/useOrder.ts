import { createCRUDMutation } from './createCRUDMutation';
import { updateOrder, updateOrderStatus, createOrder } from '../services/orderService';
import { OrderUpdateDTO } from '../dtos';

export const useUpdateOrder = createCRUDMutation({
  type: 'update',
  mutationFn: ({ id, data }: { id: number | undefined; data: OrderUpdateDTO }) =>
    updateOrder(id, data),
  queryKey: ['orders'],
  getEntityId: (vars) => vars.id!,
  idField: 'idOrder',
  successMessage: 'Заявка обновлена',
  errorMessage: 'Не удалось обновить заявку',
});

export const useUpdateOrderStatus = createCRUDMutation({
  type: 'update',
  mutationFn: ({ id, statusId }: { id: number; statusId: number }) =>
    updateOrderStatus(id, statusId),
  queryKey: ['orders'],
  getEntityId: (vars) => vars.id,
  idField: 'idOrder',
  successMessage: 'Статус заявки обновлён',
  errorMessage: 'Не удалось обновить статус заявки',
});

export const useCreateOrder = createCRUDMutation({
  type: 'create',
  mutationFn: (data: FormData) => createOrder(data),
  queryKey: ['orders'],
  addToCache: (old, newOrder) => (old ? [newOrder, ...old] : [newOrder]),
  successMessage: 'Заявка создана',
  errorMessage: 'Не удалось создать заявку',
});