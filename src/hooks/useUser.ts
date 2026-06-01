import { createCRUDMutation } from './createCRUDMutation';
import { userApi } from '../api/user';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type UserResponse = components['schemas']['UserResponseDTO'];
//type UserCreateRequest = components['schemas']['UserCreateRequestDTO'];
//type UserUpdateRequest = components['schemas']['UserUpdateDTO'];

interface UseUsersProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех пользователей
export const useUsers = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UseUsersProps = {}) => 
  useQuery<UserResponse[]>({
  queryKey: ['users'],
  queryFn: userApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});

// Создание задачи
/*
export const useCreateOrder = createCRUDMutation<OrderCreateRequest, OrderResponse>({
  type: 'create',
  mutationFn: orderApi.create,
  queryKey: ['orders'],
  addToCache: (old, newOrder) => old ? [newOrder, ...old] : [newOrder],
  successMessage: 'Заявка успешно создана',
  errorMessage: 'Не удалось создать заявку',
});*/

// Обновление задачи
/*
export const useUpdateUser = createCRUDMutation<
  { id: number; data: UserUpdateRequest },
  UserResponse
>({
  type: 'update',
  mutationFn: ({ id, data }) => taskApi.update(id, data),
  queryKey: ['tasks'],
  getEntityId: (vars) => vars.id,
  idField: 'idOrderUser',
  successMessage: 'Задача обновлёна',
  errorMessage: 'Не удалось обновить задачу',
});
*/

// Обновление статуса (отдельный эндпоинт)
/*
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
*/