import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid2,
  IconButton,
  Autocomplete
} from '@mui/material';
import dayjs from 'dayjs';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { TextInputField } from '../text-input-field';
import { Text } from '@mantine/core';
import { Close } from '@mui/icons-material';

import { TASK_STATES, safeToIso } from '../usefulFuncsAndConsts';

import { useUpdateTask } from '../../hooks/useTask';
import { useStates } from '../../hooks/useState';
import { components } from '../../types/api';
import { showNotification } from '../../context';
import { useUpdateOrder } from '../../hooks/useOrder';
type OrderTask = components['schemas']['TaskResponseDTO'];
type Order = components['schemas']['OrderResponseDTO'];

const reasons = [
  'Своя причина',
  'Ожидание ответа пользователя',
  'Ожидание поставки оборудования',
  'Технические работы',
  'Требуется согласование',
];

interface PostponeOrderTaskDialogProps {
  task?: OrderTask | null;
  order?: Order | null;
  open: boolean;
  onClose: () => void;
}

export function PostponeOrderTaskDialog({ task, order, open, onClose }: PostponeOrderTaskDialogProps) {

  const [datePostpone, setDatePostpone] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const { mutate: updateTaskMutate } = useUpdateTask();
  const { mutate: updateOrderMutate} = useUpdateOrder();
  const { data: states = [] } = useStates();

  const isFormValid = useMemo(() => {
    return (
      datePostpone !== '' &&
      selected !== null &&
      (selected === 'Своя причина' ? reason !== '' : true)
    );
  }, [datePostpone, selected, reason]);

  const handleSave = () => {
    if (!isFormValid) {
      showNotification({
        title: 'Заполните обязательные все поля',
        color: 'orange',
      });
      return;
    }
    if (order) {
      const newState = states.find(state => state.name === TASK_STATES.PENDING);
      updateOrderMutate(
        {
          id: order?.idOrder,
          data: {
            idOrderState: newState?.idOrderState,
            datePostpone: datePostpone,
            description: `${order?.description}\nЗАЯВКА ОТЛОЖЕНА (${dayjs(new Date).format('DD.MM.YYYY HH:mm')})\nПричина: ${selected === 'Своя причина' ? reason : selected}`
          } 
        }        
      );
    }
    else if (task) {
      const newState = states.find(state => state.name === TASK_STATES.PENDING);
      updateTaskMutate(
        {
          id: task.idOrderTask,
          data: {
            idTaskState: newState?.idOrderState,
            datePostpone: datePostpone,
            description: `${task?.description}\nЗАДАЧА ОТЛОЖЕНА (${dayjs(new Date).format('DD.MM.YYYY HH:mm')})\nПричина: ${selected === 'Своя причина' ? reason : selected}`,
          },
        },
      );
    }
    else {
      showNotification({
        title: 'Не указан объект откладывания',
        color: 'orange',
      });
      return;
    }
    handleClose();
  };

  // Обработчик закрытия
  const handleClose = () => {
    setDatePostpone('');
    setReason('');
    setSelected(null);
    onClose();
  };

  const handleDateChange = (newDate: DateValue) => {
    setDatePostpone(newDate ? safeToIso(dayjs(newDate)) : '');
    console.log(order);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{
      sx: {
        overflow: 'visible',
      },
    }}>

      <DialogContent >
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
                Отложить {order ? 'заявку' : 'задачу'}
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
            spacing={0}
            direction="column"
            margin="0px 0px 5px 0px"
            size={4}
          >
            <Grid2 size="auto">
              <Text fw={600}>Отложить до</Text>
            </Grid2>
            <Grid2 size="auto">
              <DateTimePicker
                w='100%'
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
          </Grid2>

          <Grid2
            container
            spacing={0}
            direction="column"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto">
              <Text fw={600}>Причина</Text>
            </Grid2>
            <Grid2>
              <Autocomplete
                size="small"
                options={reasons}
                value={selected}
                onChange={(_, value) => setSelected(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={'Выберите причину'}
                  />
                )}
              />
            </Grid2>
          </Grid2>

          {selected === 'Своя причина' && (
            <Grid2
              container
              spacing={1}
              direction="column"
              margin="0px 0px 10px 0px"
            >
              <Grid2 size="auto">
                <TextInputField
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={15}
                />
              </Grid2>
            </Grid2>
          )}
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
            color='warning'
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