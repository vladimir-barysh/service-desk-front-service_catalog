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
import { Input, Select } from '@mantine/core';


export const AccessRightCreateDialog = (props: {
  isOpen: boolean;
  rightName: string;
  rightAccessLevel: string;
  rightAllAccess: string[];
  rightDescription: string;
  onClose: any;
}) => {

  const handleClose = () => {
    props.onClose();
  };

  // @ts-ignore
  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Редактирование типа работ</DialogTitle>
      <DialogContent>
        <DialogContentText>

        </DialogContentText>
        <Input.Wrapper label="Название" withAsterisk>
          <Input size="xs" defaultValue={props.rightName}/>
        </Input.Wrapper>
        <Input.Wrapper label="Уровень доступа" withAsterisk>
          <Select
            size="xs"
            data={props.rightAllAccess}
            defaultValue={props.rightAccessLevel}
            maxDropdownHeight={200}
            searchable={true}
            clearable={false}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Описание">
          <Input size="xs" defaultValue={props.rightDescription}/>
        </Input.Wrapper>
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
