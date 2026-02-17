import React from 'react';
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
  Typography
} from '@mui/material';
import { Order } from '../../../pages/support/makeData';
import { generateCoordinationData} from './makeData';

interface SupportCoordinationTabProps {
  order: Order | null;
}

export function SupportCoordinationTab({ order }: SupportCoordinationTabProps) {

  // Получаем данные для таблицы в зависимости от типа заявки
  const coordinationData = generateCoordinationData(order);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Согласовано': return 'success.main';
      case 'Не согласовано': return 'error.main';
      case 'Ожидание': return 'warning.main';
      default: return 'text.primary';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Панель кнопок */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary" size="medium" sx={{ flex: '1 1 auto', maxWidth: 'auto' }}>
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

      {/* Информация о типе заявки */}
      <Box padding='0px 0px 10px 0px'>
        <Typography variant="subtitle2" color="text.secondary" fontSize='1.0rem'>
          Тип заявки: <strong>{order?.orderType?.name || 'не определен'}</strong>
        </Typography>
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
            {coordinationData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.sequenceNumber}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.approver}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.creationDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.deadline}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.completedDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.comment}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getStatusColor(row.status),
                      fontWeight: 'bold'
                    }}
                  >
                    {row.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}