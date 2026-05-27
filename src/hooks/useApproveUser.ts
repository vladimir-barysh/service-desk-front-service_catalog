import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { components } from '../types/api';
import { approveUserApi } from '../api/approveUser';
import { showNotification } from './../context';

type ApproveUserResponse = components['schemas']['ApproveUserResponseDTO'];
type ApproveUserUpdateRequest = components['schemas']['ApproveUserUpdateRequestDTO'];
type ApproveUserUpdateIgnoredRequest = components['schemas']['ApproveUserUpdateIgnoredRequestDTO'];

// Получение всех согласовантов по согласованию
export const useApproveUserByApprove = (approveId: number) => {
  return useQuery<ApproveUserResponse[]>({
    queryKey: ['approveUsers', 'approve', approveId],
    queryFn: () => approveUserApi.getByApproveId(approveId),
    enabled: !!approveId,
  });
};

// Получение всех согласовантов по заявке
export const useApproveUsersByOrder = (orderId: number) => {
    return useQuery<ApproveUserResponse[]>({
        queryKey: ['approveUsers', 'order', orderId],
        queryFn: () => approveUserApi.getByOrderId(orderId),
        enabled: !!orderId,
    });
};

// Обновление статуса для согласованта
export const useUpdateMyApproveUser = (orderId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ approveId, ...data }: { approveId: number } & ApproveUserUpdateRequest) =>
      approveUserApi.updateSelf(approveId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approveUsers', 'order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['approves', 'order', orderId] });
      showNotification({ title: 'Статус вашего согласования обновлён', message: '', color: 'green' });
    },
    onError: (error: Error) => {
      showNotification({ title: 'Ошибка', message: error.message, color: 'red' });
    },
  });
};

// Обновление флага игнорирования
export const useUpdateApproveUserIgnored = (orderId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number} & ApproveUserUpdateIgnoredRequest) =>
      approveUserApi.updateIgnored(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approveUsers', 'order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['approves', 'order', orderId] });
      showNotification({ title: 'Статус игнорирования обновлён', message: '', color: 'green' });
    },
    onError: (error: Error) => {
      showNotification({ title: 'Ошибка', message: error.message, color: 'red' });
    },
  });
};