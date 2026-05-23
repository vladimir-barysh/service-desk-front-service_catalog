import { useMemo } from 'react';
import { ApproveCandidatesTable } from './ApproveCandidatesTable';
import { useApproveUsersByOrder } from '../../hooks/useApproveUser';
import { useUpdateApproveUsers, useApproveCandidateForOrder } from '../../hooks/useApprove';

interface EditApproveUsersDialogProps {
  open: boolean;
  approveId: number;
  orderId: number;
  serviceId: number;
  orderTypeName?: string;
  onClose: () => void;
}

export const EditApproveUsersDialog = ({
  open,
  approveId,
  orderId,
  serviceId,
  orderTypeName,
  onClose,
}: EditApproveUsersDialogProps) => {
  const { data: candidates = [], isLoading: candidatesLoading } = useApproveCandidateForOrder(
    orderId,
    open && !!serviceId
  );
  const { data: allApproveUsers = [], isLoading: usersLoading } = useApproveUsersByOrder(orderId);
  const { mutate: updateUsers, isPending } = useUpdateApproveUsers();

  const isLoading = candidatesLoading || usersLoading;

  const initialSelection = useMemo(() => {
    if (isLoading) return {};
    const current = allApproveUsers.filter(u => u.idApprove === approveId);
    const selection: Record<string, boolean> = {};
    current.forEach(u => {
      const userId = u.userId ?? u.userId;
      if (userId) selection[String(userId)] = true;
    });
    return selection;
  }, [allApproveUsers, approveId, isLoading]);

  const handleConfirm = (selectedIds: number[]) => {
    updateUsers({ approveId, orderId, userIds: selectedIds }, { onSuccess: onClose });
  };

  return (
    <ApproveCandidatesTable
      open={open}
      title="Редактирование состава согласующих"
      candidates={candidates}
      isLoading={isLoading}
      initialSelection={initialSelection}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmButtonText="Сохранить"
      orderTypeName={orderTypeName}
      isPending={isPending}
    />
  );
};