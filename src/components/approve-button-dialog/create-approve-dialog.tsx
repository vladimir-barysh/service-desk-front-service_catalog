import { ApproveCandidatesTable } from './ApproveCandidatesTable';
import { useApproveCandidateForOrder, useCreateApprove } from '../../hooks/useApprove';
import { components } from '../../types/api';

type Order = components['schemas']['OrderResponseDTO'];

interface CreateApproveDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

export const CreateApproveDialog = ({ open, order, onClose }: CreateApproveDialogProps) => {
  const { data: candidates = [], isLoading } = useApproveCandidateForOrder(
    order?.idOrder ?? 0,
    open && !!order?.serviceId
  );
  const { mutate: createApprove, isPending } = useCreateApprove();

  const handleConfirm = (selectedIds: number[]) => {
    if (!order || !order.idOrder) return;
    createApprove({ idOrder: order.idOrder, userIds: selectedIds }, { onSuccess: onClose });
  };

  return (
    <ApproveCandidatesTable
      open={open}
      title={`Согласующие для ${order?.orderTypeName} №${order?.nomer}`}
      candidates={candidates}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmButtonText="Создать"
      orderTypeName={order?.orderTypeName}
      isPending={isPending}
    />
  );
};