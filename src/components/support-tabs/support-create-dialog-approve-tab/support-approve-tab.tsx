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
} from '@mui/material';
import {
  Pending,
  CheckCircle,
  Cancel,
  Block,
  RemoveCircle,
} from '@mui/icons-material';
import { useDialogs, CreateApproveDialog } from '../../../components';
import { components } from '../../../types/api';
import { useApprovesByOrder } from '../../../hooks/useApprove';
import { useApproveUserByApprove } from '../../../hooks/useApproveUser';

type Order = components['schemas']['OrderResponseDTO'];

interface SupportApproveTabProps {
  order: Order | null;
}

export function SupportApproveTab({ order }: SupportApproveTabProps) {
  const { dialogs, openDialog, closeDialog } = useDialogs();
  const { data: approves = [], isLoading, error } = useApprovesByOrder(order?.idOrder ?? 0);
/*   const { data: approveUser = [], isLoadingh, errorh } = useApproveUserByApprove(approve ?? 0); */
  

  if (isLoading) return <Box p={2}>Загрузка согласований...</Box>;
  if (error) return <Box p={2} color="error.main">Ошибка загрузки: {error.message}</Box>;

  // Обработчик нажатия кнопки Создать согласование 
  const handleCreateApprove = () => {
    if (!order) return;
    const type = order.orderTypeName;
    if (type === 'ЗНО' || type === 'ЗНТ') {
      openDialog('createApprove', order); // открываем диалог выбора согласующих
    } else {
      /* createAutoApprove({ idOrder: order.idOrder }); // автоматическое создание */
    }
  };

  // Цвета для статуса согласования
  const approveStatusMap: Record<number, { label: string; icon: JSX.Element, bgColor: string;}> = {
    7: { label: 'На согласовании', icon: <Pending />, bgColor: '#FFF3E0'},
    13: { label: 'Согласовано', icon: <CheckCircle />, bgColor: '#dcf7df'},
    9: { label: 'Не согласовано', icon: <Cancel />, bgColor: '#ffd7d7'},
    14: { label: 'Согласование отклонено', icon: <Block />, bgColor: '#FFEBEE'},
    15: { label: 'Согласование отменено', icon: <RemoveCircle />, bgColor: '#efefef'},
  };

  // Перевод даты в строку
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Панель кнопок */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Button 
          variant="contained"
          color="primary"
          size="medium"
          sx={{ flex: '1 1 auto', maxWidth: 'auto' }}
          disabled={!order}
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
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
          Запустить процесс
        </Button>
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
          Подтянуть согласующих из ИТ-каталога
        </Button>
      </Box>

      {/* Таблица согласования */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '80px' }}>№ п.п.</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Согласующий</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Дата создания</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Срок</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Завершено</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Комментарий</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Состояние</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approves.map((approve, index) => (
              <TableRow key={approve.idApprove}>
                <TableCell>{index + 1}</TableCell>
                {/*TODO: заменить на согласующего  */}
                <TableCell>{approve.name}</TableCell>
                <TableCell>{formatDate(approve.dateCreated)}</TableCell>
                <TableCell>{formatDate(approve.datePlan)}</TableCell>
                <TableCell>{formatDate(approve.dateFact)}</TableCell>
                <TableCell>{approve.taskText}</TableCell>
                <TableCell>
                  <Chip
                    label={approveStatusMap[approve.idApproveState]?.label || 'Неизвестно'}
                    icon={approveStatusMap[approve.idApproveState]?.icon}
                    sx={{
                      backgroundColor: approveStatusMap[approve.idApproveState]?.bgColor,
                      color: '#000000',
                      '& .MuiChip-icon': {
                        color: '#000000',
                      },
                      borderRadius: '8px',       // скругление
                      padding: '4px 8px',        // увеличиваем внутренние отступы
                      height: 'auto',            // автоматическая высота под контент
                      minHeight: '36px',         // минимальная высота
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {approves.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">Нет согласований для заявки</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалоги кнопок */}
      <CreateApproveDialog
        open={dialogs.createApprove.open}
        order={dialogs.createApprove.order}
        onClose={() => closeDialog('createApprove')}
      />
    </Box>
  );  
}