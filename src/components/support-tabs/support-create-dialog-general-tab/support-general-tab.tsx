import React from 'react';
import { Grid2, TextField, Box, Typography, Button } from '@mui/material';
import { Request } from './makeData';

interface SupportGeneralFirstTabProps {
  isOpen: boolean;
    request: Request | null;
    onClose: () => void;
}

export function SupportGeneralTab({ request, onClose }: SupportGeneralFirstTabProps) {
  if (!request) {
    return <Typography>Заявка не выбрана</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <TextField
            label="№ заявки"
            value={request.requestNumber || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Статус"
            value={request.status || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Тип запроса"
            value={request.requestType || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Дата регистрации"
            value={request.dateRegistration || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Желаемый срок"
            value={request.dateDesired || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label="Дата решения"
            value={request.dateSolution || ''}
            fullWidth
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid2>
      </Grid2>
      <Box>
        <Box position="absolute" bottom="15px" width="stretch">
          <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="center">
            <Grid2 size={3}>
              <Button
                variant="contained"
                color="primary"
                size={'small'}
                fullWidth={true}
              > Сохранить </Button>
            </Grid2>
            <Grid2 size={3} offset={{md:3}}>
              <Button
                variant="contained"
                color="inherit"
                size={'small'}
                fullWidth={true}
                onClick={onClose}
              > Отмена </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
}