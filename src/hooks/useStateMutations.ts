import { createCRUDMutation } from './createCRUDMutation';
import { stateApi } from '../api/state';
import { components } from '../types/api';
import { useQuery } from '@tanstack/react-query';

type StateResponse = components['schemas']['StateResponseDTO'];
//type TaskCreateRequest = components['schemas']['TaskCreateRequestDTO'];
//type TaskUpdateRequest = components['schemas']['TaskUpdateDTO'];

interface UseStatesProps {
  enabled?: boolean;
  staleTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
}

// Получение всех статусов
export const useStates = ({
  enabled = true,
  staleTime = 5 * 60 * 1000,
  refetchOnMount = 'always',
  refetchOnWindowFocus = true,
}: UseStatesProps = {}) => 
  useQuery<StateResponse[]>({
  queryKey: ['orderstates'],
  queryFn: stateApi.getAll,

  enabled,
  staleTime,
  refetchOnMount,
  refetchOnWindowFocus,
});

/*/ Создание задачи
export const useCreateTask = createCRUDMutation<TaskCreateRequest, TaskResponse>({
  type: 'create',
  mutationFn: taskApi.create,
  queryKey: ['tasks'],
  addToCache: (old, newTask) => old ? [newTask, ...old] : [newTask],
  successMessage: 'Задача успешно создана',
  errorMessage: 'Не удалось создать задачу',
});

// Обновление задачи
export const useUpdateTask = createCRUDMutation<
  { id: number; data: TaskUpdateRequest },
  TaskResponse
>({
  type: 'update',
  mutationFn: ({ id, data }) => taskApi.update(id, data),
  queryKey: ['tasks'],
  getEntityId: (vars) => vars.id,
  idField: 'idOrderTask',
  successMessage: 'Задача обновлёна',
  errorMessage: 'Не удалось обновить задачу',
});

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