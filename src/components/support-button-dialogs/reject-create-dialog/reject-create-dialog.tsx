import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert
} from '@mui/material';
import { Request } from '../../../pages/support/all-support/makeData';

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  request?: Request | null;
}

export function RejectDialog({ open, onClose, onConfirm, request }: RejectDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Отклонить заявку <strong>{request?.requestNumber}</strong></DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <Alert severity="warning">
            Заявка будет переведена в статус «Отклонена»
          </Alert>

          <TextField
            label="Причина отклонения"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            size="small"
            required
            helperText="Этот текст будет записан в комментарий к заявке"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Отмена
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleConfirm}
          disabled={!reason.trim()}
        >
          Отклонить
        </Button>
      </DialogActions>
    </Dialog>
  );
}