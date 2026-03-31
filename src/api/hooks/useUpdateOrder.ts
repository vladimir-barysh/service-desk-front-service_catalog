import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '../services/orderService';
import { OrderUpdateDTO } from '../dtos';
import { Order } from '../models';
import { showNotification } from './../../context';

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | undefined; data: OrderUpdateDTO }) =>
            updateOrder(id, data),
        onSuccess: (updatedOrder, variables) => {
            
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.setQueryData(['orders'], (old: Order[] | undefined) => {
               if (!old) return old;
               return old.map(order =>
                 order.idOrder === variables.id ? { ...order, ...updatedOrder } : order
               );
             });
             showNotification({ title: 'Успешно', message: 'Заявка обновлена', color: 'green',});
        },

        onError: (error: any) => {
            showNotification({ title: 'Ошибка', message: error?.response?.data?.message || error.message || 'Не удалось обновить заявку', color: 'red',});
        },
    });
};