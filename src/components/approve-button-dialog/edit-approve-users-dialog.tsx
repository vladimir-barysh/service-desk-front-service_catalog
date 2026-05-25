import { useState, useMemo, useEffect } from 'react';
import { ApproveCandidatesTable } from './ApproveCandidatesTable';
import { useApproveUsersByOrder, useUpdateApproveUserIgnored } from '../../hooks/useApproveUser';
import { useApproveCandidateForOrder, useUpdateApproveUsers } from '../../hooks/useApprove';
import { components } from '../../types/api';

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
  const [ignoredChanges, setIgnoredChanges] = useState<Map<number, boolean>>(new Map());

  // Сброс ползунков игнорирования при открытии диалога
  useEffect(() => {
    if (open) {
      setIgnoredChanges(new Map());
    }
  }, [open, approveId]);

  const { data: candidates = [], isLoading: candidatesLoading } = useApproveCandidateForOrder(
    orderId,
    open && !!serviceId
  );
  const { data: allApproveUsers = [], isLoading: usersLoading } = useApproveUsersByOrder(orderId);
  const { mutate: updateUsers, isPending: isUpdatingUsers } = useUpdateApproveUsers();
  const { mutate: updateIgnored, isPending: isUpdatingIgnored } = useUpdateApproveUserIgnored(orderId);

  const isLoading = candidatesLoading || usersLoading;

  const currentUsersMap = useMemo(() => {
    const map = new Map<number, components['schemas']['ApproveUserResponseDTO']>();
    allApproveUsers
      .filter(u => u.idApprove === approveId)
      .forEach(u => map.set(u.userId, u));
    return map;
  }, [allApproveUsers, approveId]);


  // Сортируем кандидатов: сначала те, кто уже в согласовании
  const sortedCandidates = useMemo(() => {
    if (!candidates.length) return [];
    const selectedIdsSet = new Set(currentUsersMap.keys());
    const selected = candidates.filter(c => selectedIdsSet.has(c.idUser));
    const notSelected = candidates.filter(c => !selectedIdsSet.has(c.idUser));
    return [...selected, ...notSelected];
  }, [candidates, currentUsersMap]);

  const initialSelection = useMemo(() => {
    const selection: Record<string, boolean> = {};
    currentUsersMap.forEach((_, userId) => {
      selection[String(userId)] = true;
    });
    return selection;
  }, [currentUsersMap]);

  const handleConfirm = (selectedUserIds: number[]) => {
    // Сначала обновляем состав участников
    updateUsers(
      { approveId, orderId, userIds: selectedUserIds },
      {
        onSuccess: () => {
          // После успешного обновления состава обновляем флаги игнорирования
          const ignoredPromises = Array.from(ignoredChanges.entries())
            .filter(([_,ignored]) => typeof ignored === 'boolean')
            .map(([approveUserId, ignored]) =>
              updateIgnored({ id: approveUserId, ignored })
            );
          Promise.all(ignoredPromises)
            .finally(onClose);
        },
      }
    );
  };

  const handleIgnoredChange = (approveUserId: number, newValue: boolean) => {
    setIgnoredChanges(prev => {
      const newMap = new Map(prev);
      newMap.set(approveUserId, newValue);
      return newMap;
    });
  };

  return (
    <ApproveCandidatesTable
      open={open}
      title="Редактирование состава согласующих"
      candidates={sortedCandidates}
      isLoading={isLoading}
      initialSelection={initialSelection}
      onConfirm={handleConfirm}
      onCancel={onClose}
      confirmButtonText="Сохранить"
      orderTypeName={orderTypeName}
      isPending={isUpdatingUsers}
      editMode
      currentUsersMap={currentUsersMap}
      ignoredChanges={ignoredChanges}
      onIgnoredChange={handleIgnoredChange}
      isUpdatingIgnored={isUpdatingIgnored}
    />
  );
};