import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import { TaskUpdateDTO } from '../dtos';
import { OrderTask } from '../models';
import { showNotification } from './../../context';

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | undefined; data: TaskUpdateDTO }) =>
            updateTask(id, data),
        onSuccess: (updatedTask, variables) => {
            
            queryClient.invalidateQueries({ queryKey: ['ordertasks'] });
            queryClient.setQueryData(['orders'], (old: OrderTask[] | undefined) => {
               if (!old) return old;
               return old.map(task =>
                 task.idOrderTask === variables.id ? { ...task, ...updatedTask } : task
               );
             });
             showNotification({ title: 'Успешно', message: 'Задача обновлена', color: 'green',});
        },

        onError: (error: any) => {
            showNotification({ title: 'Ошибка', message: error?.response?.data?.message || error.message || 'Не удалось обновить задачу', color: 'red',});
        },
    });
};