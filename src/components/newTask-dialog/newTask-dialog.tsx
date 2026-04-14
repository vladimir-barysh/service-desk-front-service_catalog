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

// TODO: add groups

interface RedirectTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (idExecutor: number) => void;
}

export function NewTaskDialog({ open, onClose, onSave }: RedirectTaskDialogProps) {
  // Состояния компонентов
  const [selectedExecutor, setSelectedExecutor] = useState(Number);
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

  const handleSave = () => {
    onSave(selectedExecutor);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleExecutorChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = users.find(
      (item: User) => item.idItUser === selectedId
    ) ?? null;
    setSelectedExecutor(selectedObject.idItUser);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Перенаправить задачу</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
              <Text fw={600}>Укажите исполнителя(ей)</Text>
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
            disabled={!selectedExecutor}
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