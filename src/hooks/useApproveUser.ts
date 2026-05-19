import { useQuery} from '@tanstack/react-query';
import { components } from '../types/api';
import { approveUserApi } from '../api/approveUser';

type ApproveUserResponse = components['schemas']['ApproveUserResponseDTO'];

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