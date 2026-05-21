import { useQuery} from '@tanstack/react-query';
import { createCRUDMutation } from './createCRUDMutation';
import { approveApi } from '../api/approve';
import { components } from '../types/api';

type ApproveResponse = components['schemas']['ApproveResponseDTO'];
type ApproveCreateRequest = components['schemas']['ApproveCreateRequestDTO'];
type ApproveCandidateResponse = components['schemas']['ApproveCandidateResponseDTO'];

// Получение всех согласований по заявке
export const useApprovesByOrder = (orderId: number) => {
  return useQuery<ApproveResponse[]>({
    queryKey: ['approves', 'order', orderId],
    queryFn: () => approveApi.getByOrderId(orderId),
    enabled: !!orderId,
  });
};

// Получение кандидатов для согласования
export const useApproveCandidate = (serviceId: number, enabled: boolean) => {
  return useQuery<ApproveCandidateResponse[]>({
    queryKey: ['approveCandidate', serviceId],
    queryFn: () => approveApi.getCandidate(serviceId),
    enabled: enabled,
  });
};

// Создание согласования
export const useCreateApprove = createCRUDMutation<ApproveCreateRequest, ApproveResponse>({
  type: 'create',
  mutationFn: approveApi.create,
  queryKey: ['approves'],
  invalidateKeys: (vars) => [
    ['approves', 'order', vars.idOrder],
    ['approveUsers', 'order', vars.idOrder],
  ],
  addToCache: (old, newApprove) => old ? [newApprove, ...old] : [newApprove],
  successMessage: 'Согласование успешно создано',
  errorMessage: 'Не удалось создать согласование',
});

// Запуск процесса согласования
export const useStartApproveProcess = createCRUDMutation<{ id: number; orderId: number }, ApproveResponse>({
  type: 'update',
  mutationFn: ({ id }) => approveApi.startProcess(id),
  queryKey: ['approves'],
  getEntityId: (vars) => vars.id,
  idField: 'idApprove',
  invalidateKeys: (vars) => [
    ['approves', 'order', vars.orderId],
    ['approveUsers', 'order', vars.orderId],
  ],
  successMessage: 'Процесс согласования запущен',
  errorMessage: 'Не удалось запустить процесс согласования',
});