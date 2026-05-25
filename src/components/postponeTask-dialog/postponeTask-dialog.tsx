import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid2,
  IconButton
} from '@mui/material';
import dayjs from 'dayjs';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { TextInputField } from '../text-input-field';
import { Text } from '@mantine/core';
import { Close } from '@mui/icons-material';

import { useUpdateTask } from '../../hooks/useTaskMutations';
import { useStates } from '../../hooks/useStateMutations';
import { components } from '../../types/api';
import { showNotification } from '../../context';
type OrderTask = components['schemas']['TaskResponseDTO'];

interface PostponeTaskDialogProps {
  currTask: OrderTask | null;
  open: boolean;
  onClose: () => void;
}

export function PostponeTaskDialog({ currTask, open, onClose }: PostponeTaskDialogProps) {

  const [datePostpone, setDatePostpone] = useState('');
  const [reason, setReason] = useState('');

  const { mutate: updateTaskMutate } = useUpdateTask();
  const { data: states = [] } = useStates();

  const isFormValid = useMemo(() => {
    return (
      datePostpone !== '' &&
      reason !== ''
    );
  }, [datePostpone, reason]);

  const safeToIso = (value: any): string => {
    if (!value) return '';
    const d = dayjs(value);
    return d.isValid() ? d.toISOString().split('.')[0] + 'Z' : '';
  };

  // Обработчик сохранения
  const handleSave = () => {
    if (!isFormValid) {
      showNotification({
        title: 'Заполните обязательные все поля',
        color: 'orange',
      });
      return;
    }
    if (!currTask) {
      showNotification({
        title: 'Не указана задача',
        color: 'orange',
      });
      return;
    }
    const newState = states.find(state => state.name === 'В ожидании');
    updateTaskMutate(
      {
        id: currTask.idOrderTask,
        data: {
          idTaskState: newState?.idOrderState,
          datePostpone: datePostpone,
          description: `${currTask?.description}\nЗАЯВКА ОТЛОЖЕНА\nПричина: ${reason}`,
        },
      },
    );
    handleClose();
  };

  // Обработчик закрытия
  const handleClose = () => {
    setDatePostpone('');
    setReason('');
    onClose();
  };

  const handleDateChange = (newDate: DateValue) => {
    const temp = newDate ? dayjs(newDate) : '';
    setDatePostpone(safeToIso(temp));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

      <DialogContent sx={{ minHeight: '50vh', }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Grid2
            container
            spacing={0}
            direction="row"
            alignItems="left"
            justifyContent="space-between"
          >
            <Grid2 size="auto">
              <Box fontSize="20px" fontWeight="700">
                Отложить заявку
              </Box>
            </Grid2>

            <Grid2 size="auto">
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={1}
            direction="column"
            margin="0px 0px 10px 0px"
          >
            <Grid2 size="auto">
              <Text fw={600}>Отложить до</Text>
            </Grid2>
            <Grid2 size="auto"></Grid2>
            <DateTimePicker
              placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
              valueFormat="DD.MM.YYYY HH:mm"
              withSeconds={false}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              clearable
              locale='ru'
              value={datePostpone ? dayjs(datePostpone).toDate() : null}
              onChange={(newDatePostpone) => handleDateChange(newDatePostpone)}
              minDate={new Date()}
              excludeDate={(date) => {
                return date.getDay() === 0 || date.getDay() === 6;
              }}
            />
          </Grid2>

          {/* Поле "Причина" */}
          <Grid2
            container
            spacing={1}
            direction="column"
            margin="0px 0px 10px 0px"
          >
            <Grid2 size="auto">
              <Text fw={600}>Причина</Text>
            </Grid2>
            <Grid2 size="auto">
              <TextInputField
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent >

      <DialogActions
        sx={{
          margin: '0px 15px 10px 0px',
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
          alignItems: 'bottom'
        }}
      >
        <Grid2 size={3}>
          <Button
            variant="contained"
            color="success"
            size={'small'}
            fullWidth={true}
            disabled={!isFormValid}
            onClick={handleSave}
          >
            Отложить
          </Button>
        </Grid2>
        <Grid2 size={3}>
          <Button
            variant="contained"
            color="inherit"
            size={'small'}
            fullWidth={true}
            onClick={handleClose}
          >
            Назад
          </Button>
        </Grid2>
      </DialogActions>
    </Dialog >
  );
}