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
import { TextInputField } from '../text-input-field';
import { Text } from '@mantine/core';
import { Close } from '@mui/icons-material';
import { showNotification } from '../../context';

import { useUpdateTask } from '../../hooks/useTask';
import { useUpdateOrder } from '../../hooks/useOrder';
import { useStates } from '../../hooks/useState';
import { components } from '../../types/api';
import { TASK_STATES } from '../usefulFuncsAndConsts';
type OrderTask = components['schemas']['TaskResponseDTO'];
type Order = components['schemas']['OrderResponseDTO'];

interface CloseDeclineOrderTaskDialogProps {
  order?: Order | null;
  task?: OrderTask | null;
  closeOrDecline: 'close' | 'decline';
  open: boolean;
  onClose: () => void;
}

const reasons = [
  'Своя причина',
  'Ожидание ответа пользователя',
  'Ожидание поставки оборудования',
  'Технические работы',
  'Требуется согласование',
];

const results = [
  'Свой результат',
  '1',
  '2',
  '3',
  '3',
];

export function CloseDeclineOrderTaskDialog({ order, task, closeOrDecline, open, onClose }: CloseDeclineOrderTaskDialogProps) {

  const [resultText, setResultText] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const { mutate: updateOrderMutate } = useUpdateOrder();
  const { mutate: updateTaskMutate } = useUpdateTask();
  const { data: states = [] } = useStates();

  const isFormValid = useMemo(() => {
    return (
      selected !== null &&
      (selected === 'Своя причина' || selected === 'Свой результат' ? resultText !== '' : true)
    );
  }, [selected, resultText]);

  // Обработчик сохранения
  const handleSave = () => {

    const newState = states.find(state => state.name === (closeOrDecline === 'close' ? TASK_STATES.CLOSED : TASK_STATES.REJECTED));
    
    if (!isFormValid) {
      showNotification({
        title: 'Заполните обязательные все поля',
        color: 'orange',
      });
      return;
    }
    if (order) {
      updateOrderMutate(
        {
          id: order.idOrder,
          data: {
            idOrderState: newState?.idOrderState,
            resultText: `${order ? 'Заявка' : 'Задача'} ${closeOrDecline === 'close' ? 'закрыта' : 'отклонена'} по причине:
${selected === 'Своя причина' || selected === 'Свой результат' ? resultText : selected}`,
          }
        }
      )
    }
    else if (task) {
      
      updateTaskMutate(
        {
          id: task.idOrderTask,
          data: {
            idTaskState: newState?.idOrderState,
            resultText: `${order ? 'Заявка' : 'Задача'} ${closeOrDecline === 'close' ? 'закрыта' : 'отклонена'} по причине:
${selected === 'Своя причина' || selected === 'Свой результат' ? resultText : selected}`,
          },
        },
      );

    }
    else {
      showNotification({
        title: 'Не указан объект',
        color: 'orange',
      });
      return;
    }
    handleClose();
  };

  // Обработчик закрытия
  const handleClose = () => {
    setResultText('');
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>

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
                {closeOrDecline === 'close' ? 'Закрыть' : 'Отклонить'} {order ? 'заявку' : 'задачу'}
              </Box>
            </Grid2>

            <Grid2 size="auto">
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid2>
          </Grid2>

          <Grid2 container
            spacing={1}
            direction="column"
            margin="0px 0px 10px 0px">
            <Grid2 size="auto">
              <Text fw={600}>{closeOrDecline === 'close' ? `Результат выполнения ${order ? 'заявки' : 'задачи'}` : 'Причина'} </Text>
            </Grid2>
            <Grid2>
              <Autocomplete
                size="small"
                options={closeOrDecline === 'close' ? results : reasons}
                value={selected}
                onChange={(_, value) => setSelected(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={closeOrDecline === 'close' ? 'Выберите результат' : 'Выберите причину'}
                  />
                )}
              />
            </Grid2>
          </Grid2>

          {(selected === 'Своя причина' || selected === 'Свой результат') && (
            <Grid2
              container
              spacing={1}
              direction="column"
              margin="0px 0px 10px 0px"
            >
              <Grid2 size="auto">
                <TextInputField
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
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
            color={closeOrDecline === 'close' ? 'success' : 'error'}
            size={'small'}
            fullWidth={true}
            disabled={!isFormValid}
            onClick={handleSave}
          >
            {closeOrDecline === 'close' ? 'Закрыть' : 'Отклонить'}
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