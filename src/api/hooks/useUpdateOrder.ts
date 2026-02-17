import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrder } from '../services/orderService';
import { notifications } from '@mantine/notifications';
import { OrderUpdateDTO } from '../dtos';
import { Order } from '../models';

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

            notifications.show({
                title: 'Успешно',
                message: 'Заявка обновлена',
                color: 'green',
                autoClose: 4000,
                withCloseButton: true,
                withBorder: false,
                loading: false,
                styles: (theme) => ({
                    root: {
                        backgroundColor: theme.colors.green[6],
                        borderColor: theme.colors.green[6],
                    },
                    title: { color: theme.white },
                    description: { color: theme.white },
                    closeButton: {
                        color: theme.white,
                        '&:hover': { backgroundColor: theme.colors.green[6] },
                    },
                }),
            });
        },

        onError: (error: any) => {
            notifications.show({
                title: 'Ошибка',
                message: error?.response?.data?.message || error.message || 'Не удалось обновить заявку',
                color: 'red',
                autoClose: 4000,
                withCloseButton: true,
                withBorder: false,
                loading: false,
                styles: (theme) => ({
                    root: {
                        backgroundColor: theme.colors.red[6],
                        borderColor: theme.colors.red[6],
                    },
                    title: { color: theme.white },
                    description: { color: theme.white },
                    closeButton: {
                        color: theme.white,
                        '&:hover': { backgroundColor: theme.colors.red[8] },
                    },
                }),
            });
        },
    });
};