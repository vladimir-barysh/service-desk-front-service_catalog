import { useQuery} from '@tanstack/react-query';
import { components } from '../types/api';
import { approveUserApi } from '../api/approveUser';

type ApproveUserResponse = components['schemas']['ApproveUserResponseDTO'];

// Получение всех согласований по заявке
export const useApproveUserByApprove = (approveId: number) => {
  return useQuery<ApproveUserResponse[]>({
    queryKey: ['approveUsers', 'approve', approveId],
    queryFn: () => approveUserApi.getByApproveId(approveId),
    enabled: !!approveId,
  });
};
