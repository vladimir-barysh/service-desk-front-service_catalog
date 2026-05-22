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
export const useApproveCandidateForOrder = (orderId: number, enabled: boolean) => {
  return useQuery<ApproveCandidateResponse[]>({
    queryKey: ['approveCandidate', orderId],
    queryFn: () => approveApi.getCandidate(orderId),
    enabled: enabled,
  });
};

// Создание согласования
export const useCreateApprove = createCRUDMutation<ApproveCreateRequest, ApproveResponse>({
  type: 'create',
  mutationFn: approveApi.create,
  queryKey: ({idOrder}) => ['approves', 'order', idOrder],
  invalidateKeys: (vars) => [
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
  queryKey: ({ orderId }) => ['approves', 'order', orderId],
  getEntityId: ({ id }) => id,
  idField: 'idApprove',
  invalidateKeys: (vars) => [
    ['approveUsers', 'order', vars.orderId],
  ],
  successMessage: 'Процесс согласования запущен',
  errorMessage: 'Не удалось запустить процесс согласования',
});

// Удаление согласования
export const useDeleteApprove = createCRUDMutation<{ id: number; orderId: number }, void>({
    type: 'delete',
    mutationFn: ({ id }) => approveApi.delete(id),
    queryKey: ({ orderId }) => ['approves', 'order', orderId],
    getEntityId: ({ id }) => id,
    idField: 'idApprove',
    invalidateKeys: (vars) => [
      ['approveUsers', 'order', vars.orderId],
    ],
    successMessage: 'Согласование удалено',
    errorMessage: 'Не удалось удалить согласование',
});