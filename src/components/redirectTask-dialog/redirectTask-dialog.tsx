import { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogContent,
  DialogContentText, DialogTitle,
  DialogActions, Box,
  Button, Grid2,
  IconButton, Typography,
  TextField, InputAdornment,
  FormControl, MenuItem, Select,
  SelectChangeEvent,
  Autocomplete,
} from '@mui/material';
import {
  Input, Textarea,
  Text, CloseButton,
  Radio, Group,
  Checkbox,
} from '@mantine/core';
import { TextInputField } from '../text-input-field';

import { components } from '../../types/api';
import { useUsers } from '../../hooks/useUser';
import { useUpdateTask } from '../../hooks/useTaskMutations';
import dayjs from 'dayjs';
import { showNotification } from '../../context';
import { Close } from '@mui/icons-material';
type User = components['schemas']['UserResponseDTO'];
type OrderTask = components['schemas']['TaskResponseDTO'];
interface RedirectTaskDialogProps {
  currTask: OrderTask | null;
  open: boolean;
  onClose: () => void;
}

export interface RedirectData {
  from: string;
  to: number;
  reason: string;
}

export interface Reason {
  id: number;
  reason: string;
}

export function RedirectTaskDialog({ currTask, open, onClose }: RedirectTaskDialogProps) {

  const [selectedExecutor, setSelectedExecutor] = useState<User | null>(null);
  const [reason, setReason] = useState('');
  const labelStyle = {
    margin: '0px 0px -15px 0px',
  };

  const { data: users = [] } = useUsers();
  const { mutate: updateTaskMutate } = useUpdateTask();

  const reasons: Reason[] = [
    { id: 1, reason: "Своя причина" },
    { id: 2, reason: "Первая причина" },
    { id: 3, reason: "Вторая причина" },
    { id: 4, reason: "Третья причина" }
  ]

  const isFormValid = useMemo(() => {
    return (
      selectedExecutor !== null &&
      reason !== ''
    );
  }, [selectedExecutor, reason]);

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
        title: 'Задача не выбрана',
        color: 'orange',
      });
      return;
    }
    updateTaskMutate(
      {
        id: currTask?.idOrderTask,
        data: {
          idExecutor: selectedExecutor?.idItUser,
          description: `${currTask.description}\nЗАДАЧА ПЕРЕНАПРАВЛЕНА\nДата: ${dayjs(new Date()).format('DD.MM.YYYY HH:mm')}\nПричина: ${reason}`,
        },
      },
    );
    handleClose();
  };

  // Сброс формы при закрытии
  const handleClose = () => {
    setReason('');
    setSelectedExecutor(null);
    onClose();
  };

  const handleExecutorChange = (id: number | null) => {

    const selectedObject = users.find(
      (item: User) => item.idItUser === id
    ) ?? null;
    setSelectedExecutor(selectedObject);
  };

  const handleReasonChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = reasons.find(
      (item: Reason) => item.id === selectedId
    ) ?? null;
    setReason(selectedObject?.reason || '');
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

      <DialogContent>
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
                Перенаправить задачу
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
            size={6}
            spacing={2}
            direction={'column'}
            alignItems="left"
            justifyContent="left"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto" sx={labelStyle}>
              <Text fw={600}>От кого*</Text>
            </Grid2>
            <Grid2 size="auto">
              <TextField
                value={currTask?.executorFio}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid2>
          </Grid2>

          {/* Поле "На кого" */}
          <Grid2
            container
            size={6}
            spacing={2}
            direction={'column'}
            alignItems="left"
            justifyContent="left"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto" sx={labelStyle}>
              <Text fw={600}>На кого*</Text>
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

          {/* Поле "Причина" */}
          <Grid2
            container
            size={6}
            spacing={2}
            direction={'column'}
            alignItems="left"
            justifyContent="left"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto" sx={labelStyle}>
              <Text fw={600}>Укажите причину*</Text>
            </Grid2>
            <Grid2 size="auto">
              <FormControl fullWidth size="small">
                <Select
                  onChange={handleReasonChange}
                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const r = reasons.find((x: Reason) => x.id === selected);
                    return r?.reason;
                  }}
                >
                  {reasons.map((item: Reason) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
        }}>
        <Grid2 size={3}>
          <Button
            variant="contained"
            color="success"
            size={'small'}
            fullWidth={true}
            disabled={!isFormValid}
            onClick={handleSave}
          >
            Сохранить
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
            Отмена
          </Button>
        </Grid2>
      </DialogActions>
    </Dialog>
  );
}