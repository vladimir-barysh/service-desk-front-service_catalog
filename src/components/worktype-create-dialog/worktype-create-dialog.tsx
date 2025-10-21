import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid2,
  Box, Input, FormHelperText,
} from '@mui/material';


export const WorktypeCreateDialog = (props: {
  isOpen: boolean;
  workTypeName: string;
  workTypeDescription: string;
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
      <DialogTitle>Редактирование типа работ</DialogTitle>
      <DialogContent>
        <DialogContentText>

        </DialogContentText>
          <Input id="worktypename" defaultValue={props.workTypeName} style={{ width: '100%' }}/>
          <FormHelperText id="worktypename-text">Наименование</FormHelperText>
          <Input multiline={true} maxRows={4} id="worktypedescription" defaultValue={props.workTypeDescription} style={{ width: '100%' }}/>
          <FormHelperText id="worktypedescription-text">Описание</FormHelperText>
          <Box height={100} width={500} sx={{display: 'flex', alignItems: 'flex-end'}}>
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
