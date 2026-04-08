import { createCRUDMutation } from './createCRUDMutation';
import { updateTask } from '../services/taskService';
import { TaskUpdateDTO } from '../dtos';

export const useUpdateTask = createCRUDMutation({
  type: 'update',
  mutationFn: ({ id, data }: { id: number | undefined; data: TaskUpdateDTO }) =>
    updateTask(id, data),
  queryKey: ['ordertasks'],
  getEntityId: (vars) => vars.id!,
  idField: 'idOrderTask',
  successMessage: 'Задача обновлена',
  errorMessage: 'Не удалось обновить задачу',
});