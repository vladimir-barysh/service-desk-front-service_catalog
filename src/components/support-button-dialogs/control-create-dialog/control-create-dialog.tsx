import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { DateTimePicker } from '@mantine/dates';
import { Request } from '../../../pages/support/all-support/makeData';

interface ControlDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (equipment: string, returnDate: Date | null) => void;
  request?: Request | null;
}

export function ControlDialog({ open, onClose, onConfirm, request }: ControlDialogProps) {
  const [equipment, setEquipment] = useState('');
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleConfirm = () => {
    if (equipment.trim() && returnDate) {
      onConfirm(equipment.trim(), returnDate);
      handleClose();
    }
  };

  const handleClose = () => {
    setEquipment('');
    setReturnDate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{style: { minHeight: '500px'}}}>
      <DialogTitle>Поставить заявку <strong>{request?.requestNumber}</strong> на контроль</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>          
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
              Срок возврата техники *
            </Typography>
            <DateTimePicker
              onChange={setReturnDate}
              placeholder="ДД.ММ.ГГГГ ЧЧ:ММ"
              valueFormat="DD.MM.YYYY HH:mm"
              withSeconds={false}
              clearable
              onPointerEnterCapture={undefined} 
              onPointerLeaveCapture={undefined}
              locale='ru'
              size="sm"
              styles={{ input: { minHeight: '40px' } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Заявка будет переведена в статус «На контроле»
            </Typography>
          </Box>
          
          <TextField
            label="Выданная техника"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            fullWidth
            multiline
            rows={5}
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
          color="primary"
          onClick={handleConfirm}
          disabled={!equipment.trim() || !returnDate}
        >
          Поставить на контроль
        </Button>
      </DialogActions>
    </Dialog>
  );
}