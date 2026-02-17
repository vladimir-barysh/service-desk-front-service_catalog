import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface RedirectTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: RedirectData) => void;
  currentExecutor: string;
}

export interface RedirectData {
  from: string;
  to: string;
  reason: string;
}

export function RedirectTaskDialog({ open, onClose, onSave, currentExecutor }: RedirectTaskDialogProps) {
  // Состояния компонентов
  const [formData, setFormData] = useState<RedirectData>({ from: currentExecutor, to: '', reason: '' });
  const [customReason, setCustomReason] = useState('');

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
        to: '',
        reason: ''
    }));
    setCustomReason('');
  };

  const handleCustomReasonChange = (value: string) => {
    setCustomReason(value);
    // Обновляем основную причину только когда пользователь вводит текст
    setFormData({ ...formData, reason: value });
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Перенаправить задачу</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Поле "От кого" */}
          <TextField
            label="От кого"
            value={formData.from}
            fullWidth
            size="small"
            InputProps={{
              readOnly: true
            }}
            required
          />

          {/* Поле "На кого" */}
          <TextField
            label="На кого"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            fullWidth
            size="small"
            required
          />

          {/* Поле "Причина" */}
          <TextField
            label="Укажите причину"
            value={customReason}
            onChange={(e) => handleCustomReasonChange(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            required
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Отмена
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!formData.to || !formData.reason}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}