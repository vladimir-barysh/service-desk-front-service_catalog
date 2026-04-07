import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent,
  DialogContentText, DialogTitle,
  DialogActions, Box,
  Button, Grid2,
  IconButton, Typography,
  TextField, InputAdornment,
  FormControl, MenuItem, Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Input, Textarea,
  Text, CloseButton,
  Radio, Group,
  Checkbox,
} from '@mantine/core';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query'
import { OrderCreateDTO } from '../../api/dtos';
import { AxiosError } from 'axios';
import { createOrder } from '../../api/services/orderService';
import { getUsers } from '../../api/services/userService';
import { TextInputField } from '../text-input-field';
import { User } from '../../api/models';
interface RedirectTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: RedirectData) => void;
  currentExecutor: string;
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

export function RedirectTaskDialog({ open, onClose, onSave, currentExecutor }: RedirectTaskDialogProps) {
  // Состояния компонентов
  const [formData, setFormData] = useState<RedirectData>({ from: currentExecutor, to: 0, reason: '' });
  const [customReason, setCustomReason] = useState('');
  const labelStyle = {
    margin: '0px 0px -15px 0px',
  };

  const {
    data: users = [],
    isLoading: userLoad,
    error: userError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: Infinity
  });

  const reasons: Reason[] = [
    {id: 1, reason: "Первая причина"},
    {id: 2, reason: "Вторая причина"},
    {id: 3, reason: "Третья причина"}
  ]
  // Для обновления формы при изменении currentExecutor
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        from: currentExecutor // обновляем поле "От кого" при каждом открытии
      }));
    }
  }, [open, currentExecutor]);

  const handleSave = () => {
    // Проверка обязательных полей
    if (formData.to && formData.reason && formData.from) {
      onSave(formData)
      handleClose()
    }
  };

  // Сброс формы при закрытии
  const handleClose = () => {
    onClose();
    setFormData(prev => ({
      ...prev,
      to: 0,
      reason: ''
    }));
    setCustomReason('');
  };

  const handleExecutorChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = users.find(
      (item: User) => item.idItUser === selectedId
    ) ?? null;
    setFormData({ ...formData, to: selectedObject.idItUser });
  };

  const handleCustomReasonChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = reasons.find(
      (item: Reason) => item.id === selectedId
    ) ?? null;
    setFormData({ ...formData, reason: selectedObject?.reason || '' });
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Перенаправить задачу</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Поле "От кого" */}
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
                value={formData.from}
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
              <FormControl fullWidth size="small">
                <Select
                  onChange={handleExecutorChange}
                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = users.find((x: any) => x.idItUser === selected);
                    return p?.fio1c;
                  }}
                >
                  {users.map((item: any) => (
                    <MenuItem key={item.idItUser} value={item.idItUser}>
                      {item.fio1c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  onChange={handleCustomReasonChange}
                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const r = reasons.find((x: any) => x.id === selected);
                    return r?.reason;
                  }}
                >
                  {reasons.map((item: any) => (
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
            disabled={!formData.to || !formData.reason}
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