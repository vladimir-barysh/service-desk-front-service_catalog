import React from 'react';
import { Grid2, TextField, Box, Typography } from '@mui/material';
import { Request } from './makeData';

interface SupportGeneralFirstTabProps {
  request: Request | null;
}

export function SupportGeneralTab({ request }: SupportGeneralFirstTabProps) {
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
    </Box>
  );
}