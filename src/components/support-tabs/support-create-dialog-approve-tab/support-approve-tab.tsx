import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid2,
  ButtonProps,
} from '@mui/material';
import {
  Pending,
  CheckCircle,
  Cancel,
  Block,
  RemoveCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import { useDialogs, CreateApproveDialog, EditApproveUsersDialog, CommentDialog } from '../../../components';
import { components } from '../../../types/api';
import { useApprovesByOrder, useStartApproveProcess, useDeleteApprove, useRefreshApprove } from '../../../hooks/useApprove';
import { useApproveUsersByOrder, useUpdateMyApproveUser } from '../../../hooks/useApproveUser';
import { ConfirmDialog } from '../../confirmDialog';

type Order = components['schemas']['OrderResponseDTO'];

interface SupportApproveTabProps {
  order: Order | null;
}

export function SupportApproveTab({ order }: SupportApproveTabProps) {
  const { dialogs, openDialog, closeDialog } = useDialogs();
  const [selectedApproveId, setSelectedApproveId] = useState<number | null>(null);

  const { data: approves = [], isLoading: approvesLoading, error: approvesError } = useApprovesByOrder(order?.idOrder ?? 0);
  const { data: approveUsers = [], isLoading: usersLoading, error: usersError } = useApproveUsersByOrder(order?.idOrder ?? 0);

  const isLoading = approvesLoading || usersLoading;
  const error = approvesError || usersError;

  // Мутации
  const { mutate: startProcess, isPending: isStarting } = useStartApproveProcess();
  const { mutate: deleteApprove, isPending: isDeleting } = useDeleteApprove();
  const { mutate: refreshApprove, isPending: isRefreshing } = useRefreshApprove();
  const { mutate: updateMyStatus, isPending: isUpdatingMyStatus } = useUpdateMyApproveUser(order?.idOrder ?? 0);

  // Фильтруем участников по выбранному согласованию
  const selectedApproveUsers = useMemo(() => {
    if (!selectedApproveId) return [];
    return approveUsers.filter(user => user.idApprove === selectedApproveId);
  }, [approveUsers, selectedApproveId]);

  // Цвета для статуса согласования
  const approveStatusMap: Record<number, { label: string; icon: JSX.Element, bgColor: string;}> = {
    2: { label: 'В ожидании', icon: <HourglassEmpty />, bgColor: '#FFF9C4'},
    7: { label: 'На согласовании', icon: <Pending />, bgColor: '#ffe6bd'},
    13: { label: 'Согласовано', icon: <CheckCircle />, bgColor: '#c7ffcd'},
    9: { label: 'Не согласовано', icon: <Cancel />, bgColor: '#feaeae'},
    14: { label: 'Согласование отклонено', icon: <Block />, bgColor: '#FFEBEE'},
    15: { label: 'Согласование отменено', icon: <RemoveCircle />, bgColor: '#efefef'},
  };

  // Цвета для статуса участника согласования
  const approveUserStatusMap: Record<number, { label: string; bgColor: string;}> = {
    0: { label: 'Ожидание', bgColor: '#FFF9C4'},
    1: { label: 'Согласовано', bgColor: '#c7ffcd'},
    2: { label: 'Не согласовано', bgColor: '#feaeae'},
    3: { label: 'Согласование отклонено', bgColor: '#FFEBEE'},
  };

  // Перевод даты в строку
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  // Состояния диалогов
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmRefreshOpen, setConfirmRefreshOpen] = useState(false);
  const [editUsersOpen, setEditUsersOpen] = useState(false);

  // Обработчик нажатия кнопки Создать согласование 
  const handleCreateApprove = () => {
    if (!order) return;
    openDialog('createApprove', order);
  };

  // Обработчик нажатия кнопки Изменить согласующих
  const handleEditUsers = () => {
    if (!selectedApproveId) return;
    setEditUsersOpen(true);
  };

  // Обработчик нажатия кнопки Запустить процесс
  const handleStartProcess = () => {
    if (!selectedApproveId || !order) return;
    startProcess({ id: selectedApproveId, orderId: order.idOrder });
  };

  // Обработчик нажатия кнопки Удалить согласование
  const handleDeleteClick = () => {
    if (!selectedApproveId) return;
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedApproveId || !order) return;
    deleteApprove(
      { id: selectedApproveId, orderId: order.idOrder },
      {
        onSuccess: () => {
          setSelectedApproveId(null);
          setConfirmDeleteOpen(false);
        },
      }
    );
  };

  // Обработчик нажатия кнопки Обновить согласующих
  const handleConfirmRefresh = () => {
    if (!order) return;
    refreshApprove(
      { orderId: order.idOrder },
      {
        onSuccess: () => {
          setSelectedApproveId(null);
          setConfirmRefreshOpen(false);
        },
      }
    );
  };

  const handleRefreshClick = () => {
    setConfirmRefreshOpen(true);
  };

  // Обработчики кнопок Согласовно, Не согласовано, Отклонить согласование 
  const [actionDialog, setActionDialog] = useState<{ open: boolean; approveId: number; state: number; title: string; required: boolean }>({
    open: false,
    approveId: 0,
    state: 0,
    title: '',
    required: false,
  });

  const handleApproveAction = (state: number, title: string, required: boolean) => {
    if (!selectedApproveId) return;
    setActionDialog({ open: true, approveId: selectedApproveId, state, title, required });
  };

  const handleConfirmAction = (comment: string) => {
    updateMyStatus({
      approveId: actionDialog.approveId,
      state: actionDialog.state,
      resultText: comment,
    }, {
      onSuccess: () => setActionDialog(prev => ({ ...prev, open: false }))
    });
  };

  // Доступность кнопок на панели
  const selectedApprove = approves.find(a => a.idApprove === selectedApproveId);
  const orderClosed = order?.orderStateName === 'Закрыта';
  const isApproveCompleted = selectedApprove ? [13, 9].includes(selectedApprove.idApproveState) : false;
  const isAlreadyStarted = selectedApprove?.idApproveState === 7;
  // TODO: Получить информацию о текущем пользователе из контекста
  const currentUserApprove = selectedApproveUsers.find(u => u.userId === 1);
  const canVote = currentUserApprove && currentUserApprove.state === 0 && isAlreadyStarted;

  // Обёртка для кнопок панели
  const ActionButton = (props: ButtonProps) => {
    return (
      <Button
        variant="contained"
        size="medium"
        sx={{ flex: '1 1 auto', maxWidth: 'auto' }}
        {...props}
      />
    );
  };

  if (isLoading) return <Box p={2}>Загрузка согласований...</Box>;
  if (error) return <Box p={2} color="error.main">Ошибка загрузки: {error.message}</Box>;

  return (
    <Box sx={{ p: 2 }}>

      {/* Панель кнопок */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <ActionButton 
          color="primary"
          disabled={!order || orderClosed}
          onClick={handleCreateApprove}
        >
          Создать согласование
        </ActionButton>
        <ActionButton 
          color="warning"
          disabled={!selectedApproveId || isApproveCompleted}
          onClick={handleEditUsers}
        >
          Изменить согласование
        </ActionButton>
        <ActionButton 
          color="error"
          disabled={!selectedApproveId || isApproveCompleted || isDeleting}
          onClick={handleDeleteClick}
        >
          Удалить согласование
        </ActionButton>
        <ActionButton 
          color="success" 
          onClick={handleStartProcess}
          disabled={!selectedApproveId || isAlreadyStarted || isStarting}
        >
          Запустить процесс
        </ActionButton>
        <ActionButton
          color="primary"
          onClick={handleRefreshClick}
          disabled={isRefreshing || !order  || approves.length === 0}
        >
          Обновить согласующих
        </ActionButton>
        <ActionButton
          color="success"
          disabled={!selectedApproveId || !canVote || isUpdatingMyStatus}
          onClick={() => handleApproveAction(1, 'Согласовано', false)}
        >
          Согласовано
        </ActionButton>
        <ActionButton
          color="error"
          disabled={!selectedApproveId || !canVote || isUpdatingMyStatus}
          onClick={() => handleApproveAction(2, 'Не согласовано', true)}
        >
          Не согласовано
        </ActionButton>
        <ActionButton
          color="inherit"
          disabled={!selectedApproveId || !canVote || isUpdatingMyStatus}
          onClick={() => handleApproveAction(3, 'Отклонить согласование', false)}
        >
          Отклонить согласование
        </ActionButton>
      </Box>

        <Grid2 container spacing={2}>
        {/* MASTER: таблица согласований */}
        <Grid2 size={6}>
          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead sx={{ bgcolor: 'grey.200', '& th': { bgcolor: 'grey.200' }}}>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approves.map((approve, index) => (
                  <TableRow
                    key={approve.idApprove}
                    hover
                    onClick={() => setSelectedApproveId(approve.idApprove)}
                    selected={selectedApproveId === approve.idApprove}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{approve.name}</TableCell>
                    <TableCell>{formatDate(approve.dateCreated)}</TableCell>
                    <TableCell>
                      <Chip
                        label={approveStatusMap[approve?.idApproveState ?? 0]?.label || 'Неизвестно'}
                        icon={approveStatusMap[approve?.idApproveState ?? 0]?.icon}
                        size="small"
                        sx={{
                          backgroundColor: approveStatusMap[approve?.idApproveState ?? 0]?.bgColor,
                          color: '#000000',
                          '& .MuiChip-icon': { color: '#000000' },
                          borderRadius: '8px',
                          padding: '4px 8px',
                          height: 'auto',
                          minHeight: '36px',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {approves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Нет согласований</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        {/* DETAIL: таблица участников выбранного согласования */}
        <Grid2 size={6}>
          <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead sx={{ bgcolor: 'grey.200', '& th': { bgcolor: 'grey.200' }}}>
                <TableRow>
                  <TableCell>Согласующий</TableCell>
                  <TableCell>Срок</TableCell>
                  <TableCell>Завершено</TableCell>
                  <TableCell>Комментарий</TableCell>
                  <TableCell>Статус участника</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedApproveUsers.map(user => (
                  <TableRow key={user.idApproveUser}>
                    <TableCell>{user.userFio}</TableCell>
                    <TableCell>{formatDate(user.datePlan)}</TableCell>
                    <TableCell>{formatDate(user.dateFact)}</TableCell>
                    <TableCell>{user.resultText || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={approveUserStatusMap[user.state]?.label || 'Неизвестно'}
                        size="small"
                        sx={{ bgcolor: approveUserStatusMap[user.state]?.bgColor }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!selectedApproveId && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Выберите согласование</TableCell>
                  </TableRow>
                )}
                {selectedApproveId && selectedApproveUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Нет участников</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>

      {/* Диалоги создания согласования */}
      <CreateApproveDialog
        open={dialogs.createApprove.open}
        order={dialogs.createApprove.order}
        onClose={() => closeDialog('createApprove')}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Подтверждение удаления"
        message={
          <>
            Вы действительно хотите удалить согласование?<br />
            <strong>Внимание:</strong> вместе с ним будут удалены данные об участниках согласования.
          </>
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
        confirmText="Удалить"
        confirmColor="error"
      />
      
      {/* Диалог подтверждения обновление согласований */}
      <ConfirmDialog
        open={confirmRefreshOpen}
        title="Обновить согласующих"
        message={
          <>
            <strong>Внимание:</strong> все существующие согласования будут удалены,<br />
            а данные участников будут перезаписаны
          </>
        }
        onConfirm={handleConfirmRefresh}
        onCancel={() => setConfirmRefreshOpen(false)}
        confirmText="Обновить"
        confirmColor="primary"
      />

      {/* Диалог именения согласования */}
      {selectedApproveId && order && (
        <EditApproveUsersDialog
          key={selectedApproveId}
          open={editUsersOpen}
          approveId={selectedApproveId}
          orderId={order.idOrder}
          serviceId={order.serviceId}
          orderTypeName={order?.orderTypeName}
          onClose={() => setEditUsersOpen(false)}
        />
      )}

      {/* Диалог комментария */}
      <CommentDialog
        open={actionDialog.open}
        title={`Подтверждение: ${actionDialog.title}`}
        onConfirm={handleConfirmAction}
        onClose={() => setActionDialog(prev => ({ ...prev, open: false }))}
        required={actionDialog.required}
      />
    </Box>
  );
}