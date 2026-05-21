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
} from '@mui/material';
import {
  Pending,
  CheckCircle,
  Cancel,
  Block,
  RemoveCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import { useDialogs, CreateApproveDialog } from '../../../components';
import { components } from '../../../types/api';
import { useApprovesByOrder, useCreateApprove, useStartApproveProcess } from '../../../hooks/useApprove';
import { useApproveUsersByOrder } from '../../../hooks/useApproveUser';

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

  const { mutate: createApprove, isPending } = useCreateApprove();
  const { mutate: startProcess, isPending: isStarting } = useStartApproveProcess();

  // Фильтруем участников по выбранному согласованию
  const selectedApproveUsers = useMemo(() => {
    if (!selectedApproveId) return [];
    return approveUsers.filter(user => user.idApprove === selectedApproveId);
  }, [approveUsers, selectedApproveId]);

  // Цвета для статуса согласования
  const approveStatusMap: Record<number, { label: string; icon: JSX.Element, bgColor: string;}> = {
    2: { label: 'В ожидании', icon: <HourglassEmpty />, bgColor: '#FFF9C4'},
    7: { label: 'На согласовании', icon: <Pending />, bgColor: '#ffe6bd'},
    13: { label: 'Согласовано', icon: <CheckCircle />, bgColor: '#dcf7df'},
    9: { label: 'Не согласовано', icon: <Cancel />, bgColor: '#ffd7d7'},
    14: { label: 'Согласование отклонено', icon: <Block />, bgColor: '#FFEBEE'},
    15: { label: 'Согласование отменено', icon: <RemoveCircle />, bgColor: '#efefef'},
  };

  // Цвета для статуса участника согласования
  const approveUserStatusMap: Record<number, { label: string; bgColor: string;}> = {
    0: { label: 'Ожидание', bgColor: '#FFF9C4'},
    1: { label: 'Согласовано', bgColor: '#dcf7df'},
    2: { label: 'Отклонено', bgColor: '#ffd7d7'},
  };

  // Перевод даты в строку
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  // Обработчик нажатия кнопки Создать согласование 
  const handleCreateApprove = () => {
    if (!order) return;
    const type = order.orderTypeName;
    if (type === 'ЗНО' || type === 'ЗНТ') {
      openDialog('createApprove', order); // открываем диалог выбора согласующих
    } else {
      createApprove({ idOrder: order.idOrder });
    }
  };

  // Обработчик нажатия кнопки Запустить процесс
  const handleStartProcess = () => {
    if (!selectedApproveId || !order) return;
    startProcess({ id: selectedApproveId, orderId: order.idOrder });
  };

  // Доступность кнопок на панели
  const selectedApprove = approves.find(a => a.idApprove === selectedApproveId);
  const isAlreadyStarted = selectedApprove?.idApproveState === 7;

  if (isLoading) return <Box p={2}>Загрузка согласований...</Box>;
  if (error) return <Box p={2} color="error.main">Ошибка загрузки: {error.message}</Box>;

  return (
    <Box sx={{ p: 2 }}>

      {/* Панель кнопок */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Button 
          variant="contained"
          color="primary"
          size="medium"
          sx={{ flex: '1 1 auto', maxWidth: 'auto' }}
          disabled={isPending || !order}
          onClick={handleCreateApprove}
        >
          Создать согласование
        </Button>
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
          Изменить согласование
        </Button>
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
          Удалить согласование
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          size="medium" 
          sx={{ flex: '1 1 auto', maxWidth: 'auto' }}
          onClick={handleStartProcess}
          disabled={!selectedApproveId || isAlreadyStarted || isStarting}
        >
          Запустить процесс
        </Button>
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
          Обновить согласующих
        </Button>
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
                    <TableCell>{user.taskText || '—'}</TableCell>
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

      {/* Диалоги кнопок */}
      <CreateApproveDialog
        open={dialogs.createApprove.open}
        order={dialogs.createApprove.order}
        onClose={() => closeDialog('createApprove')}
      />
    </Box>
  );  
}