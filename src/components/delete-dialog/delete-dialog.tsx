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

export const DeleteDialog = (props: {
  isOpen: boolean;
  pageName: string;
  typeName: string | undefined;
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
      <DialogTitle>Удаление: {props.pageName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы действительно хотите удалить: {props.pageName} &quot;{props.typeName}&quot;?
        </DialogContentText>
        <Box height={100} sx={{display: 'flex', alignItems: 'flex-end'}}>
          <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="center" flex={2}>
            <Grid2 size={4} >
              <Button
                variant="contained"
                color="error"
                size={'small'}
                fullWidth={true}
              >
                Удалить
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
