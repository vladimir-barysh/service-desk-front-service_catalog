import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box, Grid2
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Close } from '@mui/icons-material';

interface TextInputFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
}

export const TextInputField = ({
  value,
  onChange,
  label = 'Комментарий',
  placeholder = 'Введите текст...',
  disabled = false,
  readonly = false,
  variant = 'outlined'
}: TextInputFieldProps) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleOpen = () => {
    setTempValue(value);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    //onChange(tempValue);
    setOpen(false);
  };

  return (
    <>
      <TextField
        fullWidth
        size='small'
        variant={variant}
        value={value}
        placeholder={placeholder}
        InputProps={{
          readOnly: false,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleOpen}
                disabled={disabled}
                edge="end"
                aria-label="редактировать комментарий"
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          
        }}
        onClick={handleOpen} // ← клик по всему полю тоже открывает
        sx={{ pointerEvents: disabled ? 'none' : 'auto' }}
      />

      {/* Диалог для полноценного редактирования */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>

        <DialogContent>
            <Grid2 container alignItems="center" justifyContent="space-between">
                <Grid2></Grid2>
                <Grid2>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' }
                        }}
                    >
                        <Close/>
                    </IconButton>
                </Grid2>
            </Grid2>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={10}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              variant="outlined"
              autoFocus
              disabled={disabled}
              InputProps={{
                readOnly: readonly
              }}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>

        <Grid2 size='auto' sx={{ margin: '0px 25px 20px 10px', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
                variant="contained"
                size="small"
                disabled={readonly}
                onClick={handleSave}
                sx={{ minWidth: '100px' }}
            >
                Сохранить
            </Button>
            <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={handleClose}
                sx={{ minWidth: '100px' }}
            >
                Отмена
            </Button>
        </Grid2>
      </Dialog>
    </>
  );
};