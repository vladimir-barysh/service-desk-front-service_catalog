import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogContent,
  DialogActions, Box,
  Button, Grid2,
  IconButton,
  TextField,
  Autocomplete,
} from '@mui/material';
import { Text, Radio, Group } from '@mantine/core';
import { TextInputField } from '../text-input-field';
import { Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import { showNotification } from '../../context';


import { components } from '../../types/api';
import { useCreateTask } from '../../hooks/useTaskMutations';
import { useUsers } from '../../hooks/useUserMutations';
import { DateTimePicker, DateValue } from '@mantine/dates';
type TaskCreateRequestDTO = components['schemas']['TaskCreateRequestDTO'];
type User = components['schemas']['UserResponseDTO'];
type Order = components['schemas']['OrderResponseDTO'];

// TODO: add groups

interface NewTaskDialogProps {
  currOrder: Order | null;
  idParent?: number;
  open: boolean;
  onClose: () => void;
}

export function NewTaskDialog({ currOrder, idParent, open, onClose }: NewTaskDialogProps) {
  // Состояния компонентов
  const [selectedExecutor, setSelectedExecutor] = useState<User | null>(null);
  const [parentClose, setParentClose] = useState<string>('');
  const [dateFinishPlan, setDateFinishPlan] = useState<string>('');
  const [description, setDescription] = useState<string>(currOrder?.description || '');

  const { mutate: createTaskMutation } = useCreateTask();

  const labelStyle = {
    margin: '0px 0px -15px 0px',
  };

  const { data: users = [] } = useUsers();

  const isFormValid = useMemo(() => {

    return (
      parentClose !== '' &&
      selectedExecutor !== null &&
      description !== ''
    );
  }, [parentClose, selectedExecutor, description]);

  const handleSave = () => {

    if (!isFormValid) {
      showNotification({
        title: 'Заполните обязательные все поля',
        color: 'orange',
      });
      return;
    }
    if (!currOrder) {
      showNotification({
        title: 'Не указана заявка',
        color: 'orange',
      });
      return;
    }

    const dto: TaskCreateRequestDTO = {
      idOrder: currOrder.idOrder,
      idOrderTaskParent: idParent !== null ? idParent : undefined,
      // TODO: Добавить возможность выбирать работу
      idWork: undefined,
      idExecutor: selectedExecutor?.idItUser,
      closeParentCheck: parentClose === 'Да' ? true : false,
      dateFinishPlan: dateFinishPlan,
      description: description
    };

    createTaskMutation(dto, {
      onSuccess: () => handleClose(),
    });

  };

  const handleClose = () => {
    setSelectedExecutor(null);
    setDateFinishPlan('');
    setDescription(currOrder?.description || '');
    setParentClose('');

    onClose();
  };

  const handleExecutorChange = (id: number | null) => {

    const selectedObject = users.find(
      (item: User) => item.idItUser === id
    ) ?? null;
    setSelectedExecutor(selectedObject);
  };

  const handleParentCloseChange = (value: string) => {
    setParentClose(value);
  };

  const handleDateChange = (date: DateValue) => {
    const temp = date ? dayjs(date).toISOString().split('.')[0] + 'Z' : '';
    setDateFinishPlan(temp);
  };

  const addWorkDays = (startDate: Date, daysToAdd: number): Date => {
    const result = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      result.setDate(result.getDate() + 1);
      // Если это рабочий день (пн-пт), увеличиваем счетчик
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }

    return result;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">

      <DialogContent sx={{ minHeight: '45vh', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>

          <Box fontSize='20px' fontWeight='700'>
            {idParent === null ? 'Новая задача' : 'Новая подзадача'}
          </Box>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>

        </Box>

        <Box
          width='80vh'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 1
          }}
        >
          <Grid2
            container
            spacing={0}
            direction="row"
            alignItems="left"
            justifyContent="space-between"
            margin='10px 0px 20px 0px'
          >
            <Grid2
              container
              spacing={3}
              direction={'row'}
              alignItems="center"
              justifyContent="left"
              padding="0px 0px 0px 0px"
            >
              <Grid2 size='auto'>
                <Text fw={600}>Удалять родителя *</Text>
              </Grid2>
              <Radio.Group
                value={parentClose}
                onChange={handleParentCloseChange}
                withAsterisk
              >
                <Group>
                  <Radio
                    fw={200}
                    label="Да"
                    value="Да"
                  />

                  <Radio
                    fw={200}
                    label="Нет"
                    value="нет"
                  />
                </Group>
              </Radio.Group>
            </Grid2>

            <Grid2 container spacing={1} alignItems="center" size="auto">
              <Grid2 size="auto">
                <Text fw={600}>Желаемый срок</Text>
              </Grid2>
              <Grid2 size="auto">
                <DateTimePicker
                  placeholder="ДД.MM.ГГ ЧЧ:ММ"
                  valueFormat="DD.MM.YYYY HH:mm"
                  withSeconds={false}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  clearable
                  locale="ru"
                  onChange={(finishDate) => handleDateChange(finishDate)}
                  minDate={addWorkDays(new Date(), 3)}
                  excludeDate={(date) => {
                    return date.getDay() === 0 || date.getDay() === 6;
                  }}
                />
              </Grid2>
            </Grid2>
          </Grid2>

          <Grid2
            container
            size={6}
            spacing={2}
            direction={'column'}
            alignItems="left"
            justifyContent="left"
            margin="0px 0px 20px 0px"
          >
            <Grid2 size="auto" sx={labelStyle}>
              <Text fw={600}>Исполнитель(и) *</Text>
            </Grid2>
            <Grid2 size="auto">
              <Autocomplete
                fullWidth
                size="small"
                options={users}
                value={
                  users.find((x: User) => x.idItUser === selectedExecutor?.idItUser) || null
                }
                onChange={(_, newValue) => {
                  handleExecutorChange(newValue?.idItUser || null);
                }}
                getOptionLabel={(option: User) => option.fio1c || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Не выбран"
                  />
                )}
              />
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={1}
            direction="column"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto">
              <Text fw={600}>Описание *</Text>
            </Grid2>
            <Grid2 size="auto">
              <TextInputField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </Grid2>
          </Grid2>

        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          margin: '0px 15px 15px 0px',
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleSave}
          sx={{ minWidth: '100px' }}
          disabled={!isFormValid}
        >
          Создать
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          onClick={handleClose}
          sx={{ minWidth: '100px' }}
        >
          Назад
        </Button>
      </DialogActions>
    </Dialog>
  );
}