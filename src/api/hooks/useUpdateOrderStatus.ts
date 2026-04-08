import { createCRUDMutation } from './createCRUDMutation';
import { updateOrderStatus } from '../services/orderService';

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