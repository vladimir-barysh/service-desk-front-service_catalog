import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';

interface PostponeTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PostponeData) => void;
  currentDate?: string;
}

export interface PostponeData {
  postponeUntil: string;
  reason: string;
}

export function PostponeTaskDialog({ open, onClose, onSave, currentDate }: PostponeTaskDialogProps) {
  const [formData, setFormData] = useState<PostponeData>({
    postponeUntil: currentDate || '',
    reason: ''
  });

  // Обработчик сохранения
  const handleSave = () => {
    if (formData.postponeUntil && formData.reason) {
      onSave(formData);
      handleClose();
    }
  };

  // Обработчик закрытия
  const handleClose = () => {
    onClose();
    setFormData({
      postponeUntil: currentDate || '',
      reason: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Отложить задачу</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Поле "Отложено до" */}
          <TextField
            label="Отложено до"
            value={formData.postponeUntil}
            onChange={(e) => setFormData({ ...formData, postponeUntil: e.target.value })}
            fullWidth
            size="small"
            required
            helperText="Формат: дд.мм.гг ч.мм"
          />

          {/* Поле "Причина" */}
          <TextField
            label="Причина"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            fullWidth
            multiline
            rows={3}
            size="small"
            required
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          color="inherit">
          Отмена
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!formData.postponeUntil || !formData.reason}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}