import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid2,
  Box,
} from '@mui/material';
import { Input, Textarea } from '@mantine/core';


export const HistoryFixationCreateDialog = (props: {
  isOpen: boolean;
  onClose: any;
}) => {

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Создать фиксацию</DialogTitle>
      <DialogContent>
        <DialogContentText>

        </DialogContentText>
        <Input.Wrapper label="Примечание к фиксации" withAsterisk>
          <Textarea size="xs" minRows={2} maxRows={2}/>
        </Input.Wrapper>
          <Box height={70} width={500} sx={{display: 'flex', alignItems: 'flex-end'}}>
            <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="center" flex={2}>
              <Grid2 size={4} >
                <Button
                  variant="contained"
                  color="primary"
                  size={'small'}
                  fullWidth={true}
                >
                  Сохранить
                </Button>
              </Grid2>
              <Grid2 size={4} offset={{md:3}}>
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
            </Grid2>
          </Box>
      </DialogContent>
    </Dialog>
  );
}
