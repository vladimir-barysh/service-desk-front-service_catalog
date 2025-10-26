import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  //FormControl,
  //FormHelperText,
  //FormLabel,
  //InputLabel,
  //TextField,
  Box,
  Button,
  Grid2
} from '@mui/material';
import { Input, Textarea, Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

export const RequestCreateZNODialog = (props: {
  isOpen: boolean;
  onClose: any;
}) => {
    const handleClose = () => {
        props.onClose();
    };

  return (
    <div>
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
        <DialogTitle>Создание заявки на обслуживание</DialogTitle>

        <DialogContent sx={{minHeight: '70vh', minWidth: '75vh', padding:"20x"}}>
            <DialogContentText>
            </DialogContentText>
            <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" paddingBottom="15px">
                <Grid2 size={3}>
                    <Button
                    variant="contained"
                    color="primary"
                    size={'small'}
                    fullWidth={true}
                    >
                    Выберите ИТ-сервис
                    </Button>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left">
                <Grid2 size={2}>
                    <Text fw={600}>Желаемый срок</Text>
                </Grid2>
                <Grid2 size={3}>
                    <DateTimePicker
                    placeholder="ДД.MM.ГГ ЧЧ:ММ"
                    valueFormat="DD.MM.YYYY HH:mm"
                    withSeconds={false} 
                    onPointerEnterCapture={undefined} 
                    onPointerLeaveCapture={undefined}
                    variant='filled'
                    locale='ru'  
                    />
                </Grid2>
            </Grid2>
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingTop="15px">
                <Grid2 size={2}>
                    <Text fw={600}>Сервис/модуль</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input variant='filled'/>
                    </Input.Wrapper>
                </Grid2>
            </Grid2>  
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingTop="15px" paddingBottom="10px">
                <Grid2 size={2}>
                    <Text fw={600}>Услуга</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input variant='filled'/>
                    </Input.Wrapper>
                </Grid2>
            </Grid2>
            
            <Input.Wrapper label="Подробное описание проблемы" size='md'>
                <Textarea
                variant="filled"
                autosize
                minRows={4}
                maxRows={4}
                // value={value} 
                // onChange={(e) => setValue(e.currentTarget.value)}
                />
            </Input.Wrapper>
            <Input.Wrapper label="Ожидаемый результат" size='md'>
                <Textarea
                variant="filled"
                autosize
                minRows={2}
                maxRows={2}
                // value={value} 
                // onChange={(e) => setValue(e.currentTarget.value)}
                />
            </Input.Wrapper>
            <Input.Wrapper label="Комментарий" size='md'>
                <Textarea
                variant="filled"
                autosize
                minRows={2}
                maxRows={2}
                // value={value} 
                // onChange={(e) => setValue(e.currentTarget.value)}
                />
            </Input.Wrapper>
            <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" paddingTop="15px">
                <Grid2 size={3}>
                    <Button
                    variant="contained"
                    color="primary"
                    size={'small'}
                    fullWidth={true}
                    >
                    Добавить файл
                    </Button>
                </Grid2>
            </Grid2>
            <Box>
                <Box position="absolute" bottom="20px" width="stretch">
                    <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left">
                    <Grid2 size={3} >
                        <Button
                        variant="contained"
                        color="primary"
                        size={'small'}
                        fullWidth={true}
                        >
                        Сохранить
                        </Button>
                    </Grid2>
                    <Grid2 size={3}>
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
            </Box>
        </DialogContent>
    </Dialog>
    </div>
  );
}
