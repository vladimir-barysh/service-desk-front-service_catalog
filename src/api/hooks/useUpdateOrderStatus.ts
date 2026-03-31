import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../services/orderService';
import { showNotification } from './../../context';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusId }: { id: number; statusId: number }) =>
      updateOrderStatus(id, statusId),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showNotification({ title: 'Успешно', message: 'Статус обновлён', color: 'green',});
    },
    onError: (error) => {
        showNotification({ title: 'Ошибка', message: error.message, color: 'red',});
    },
  });
};