import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface CommentDialogProps {
  open: boolean;
  title: string;
  onConfirm: (comment: string) => void;
  onClose: () => void;
  required?: boolean; // по умолчанию false (комментарий не обязателен)
}

export const CommentDialog = ({
  open,
  title,
  onConfirm,
  onClose,
  required = false,
}: CommentDialogProps) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (required && !comment.trim()) return;
    onConfirm(comment.trim());
    setComment('');
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          rows={4}
          label="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          required={required}
          error={required && !comment.trim()}
          helperText={required && !comment.trim() ? 'Обязательное поле' : ''}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={required && !comment.trim()}
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};