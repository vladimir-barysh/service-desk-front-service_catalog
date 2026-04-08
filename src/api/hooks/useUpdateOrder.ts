import { createCRUDMutation } from './createCRUDMutation';
import { updateOrder } from '../services/orderService';
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