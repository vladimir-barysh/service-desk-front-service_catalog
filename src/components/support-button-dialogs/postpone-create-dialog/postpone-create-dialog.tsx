// components/postpone-dialog/postpone-dialog.tsx
import React, { useState } from 'react';
import { Request } from '../../../pages/support/all-support/makeData';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface PostponeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  request?: Request | null;
}

export function PostponeDialog({ open, onClose, onConfirm, request }: PostponeDialogProps) {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (comment.trim()) {
      onConfirm(comment.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Отложить заявку {request?.requestNumber} </DialogTitle>
      <DialogContent>
        <TextField
            label="Причина откладывания"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={5}
            size="small"
            required
            helperText="Этот текст будет помещен в поле «Комментарий» заявки"
            sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Отмена
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={handleConfirm}
          disabled={!comment.trim()}
        >
          Отложить
        </Button>
      </DialogActions>
    </Dialog>
  );
}