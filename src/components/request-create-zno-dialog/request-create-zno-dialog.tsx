import React from 'react';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Grid2,
  Chip,
  Paper,
  IconButton, Typography
} from '@mui/material';
import { Input, Textarea, Text, CloseButton } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

import { ChooseServiceCreateDialog } from '../itservice-choose';
import { ItSystem } from '../itservice-choose/makeData';
import { Grid } from '@mui/joy';

import { TextInputField } from '../text-input-field';

import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services/ServiceService';
import { getCatItems } from '../../api/services/CatItemService';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FileListContainer = styled(Paper)(({ theme }) => ({
  height: '60px',
  overflow: 'auto',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const RequestCreateZNODialog = (props: {
  isOpen: boolean;
  onClose: any;
}) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [chosen, setChosen] = React.useState<ItSystem | null>(null);
    
    const [problemDescription, setProblemDescription] = useState('');
    const [expectedResult, setExpectedResult] = useState('');
    const [comment, setComment] = useState('');

    const isFormValid = useMemo(() => {
        return (
            chosen !== null && 
            problemDescription.trim() !== '' && 
            expectedResult.trim() !== ''
        );
    }, [chosen, problemDescription, expectedResult]);

    function CreateDialog() {
        setIsCreateDialogOpen(true);
    }
    const onCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    }

    const handleClose = () => {
        setChosen(null);
        setProblemDescription('');
        setExpectedResult('');
        setComment('');
        setFiles([]);
        props.onClose();
    };

    const handleSave = () => {
        if (!isFormValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const formData = {
            service: chosen,
            problemDescription,
            expectedResult,
            comment,
            files
        };

        console.log('Данные для сохранения:', formData);
        
        handleClose();
    };

    

    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
        const newFiles = Array.from(selectedFiles);
        setFiles(prev => [...prev, ...newFiles]);
        }
        event.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
  return (
    <div>
    <ChooseServiceCreateDialog
           isOpen={isCreateDialogOpen}
           onClose={onCreateDialogClose}
           onSelect={(s) =>{
            setChosen(s);

           }}
    />    
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
        <DialogContent sx={{minHeight: '70vh', minWidth: '75vh', padding:"20x"}}>
            <Grid2 container spacing={0} direction={'row'} alignItems="left" justifyContent="space-between">
                <Grid2 size='auto'>
                    <Box fontSize='25px' fontWeight='700'>
                        Регистрация ЗНО
                    </Box>
                </Grid2>
                <Grid2 size='auto'>
                    <IconButton onClick={handleClose}>
                        <Close/>
                    </IconButton>
                </Grid2>
            </Grid2>
            <Box fontSize='15px' fontWeight='500' marginBottom='10px' sx={{color: 'error.main'}}>
                Пункты с * обязательны к заполнению
            </Box>
            <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" paddingTop='5px'>
                <Grid2 size={3}>
                    <Button
                    variant="contained"
                    color="primary"
                    size={'small'}
                    fullWidth={true}
                    onClick={CreateDialog}
                    >
                    Выберите ИТ-сервис *
                    </Button>
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingTop="15px">
                <Grid2 size={2}>
                    <Text fw={600}>Сервис/модуль</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input 
                           variant='filled' 
                           value={chosen?.name ?? ""}
                           readOnly
                           rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setChosen(null)}
                                style={{ display: chosen ? undefined : 'none' }}
                            />}
                           />
                    </Input.Wrapper>
                </Grid2>
            </Grid2>  
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingTop="15px" >
                <Grid2 size={2}>
                    <Text fw={600}>Услуга</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input 
                           variant='filled'
                           value={chosen?.name ?? ""}
                           readOnly
                           rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setChosen(null)}
                                style={{ display: chosen ? undefined : 'none' }}
                            />}
                           />
                    </Input.Wrapper>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingTop="15px" paddingBottom="10px">
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
                    clearable
                    variant='filled'
                    locale='ru'  
                    />
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={1} direction='column' margin='0px 0px 10px 0px'>
                <Grid2 size='auto' >
                    <Text fw={600}>Подробное описание проблемы *</Text>
                </Grid2>
                <Grid2 size='auto'>
                    <TextInputField
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                    />
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={1} direction='column' margin='0px 0px 10px 0px'>
                <Grid2 size='auto' >
                    <Text fw={600}>Ожидаемый результат *</Text>
                </Grid2>
                <Grid2 size='auto'>
                    <TextInputField
                        value={expectedResult}
                        onChange={(e) => setProblemDescription(e.target.value)}
                    />
                </Grid2>
            </Grid2>
            <Grid2 container spacing={1} direction='column' margin='0px 0px 10px 0px'>
                <Grid2 size='auto' >
                    <Text fw={600}>Комментарий</Text>
                </Grid2>
                <Grid2 size='auto'>
                    <TextInputField
                        value={comment}
                        onChange={(e) => setProblemDescription(e.target.value)}
                    />
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={3} direction={'row'} paddingTop="15px" alignItems="left" justifyContent="left" >
                <Grid2 size={3} paddingTop="15px">
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        color="primary"
                        size={'small'}
                        fullWidth={true}
                        >
                        Прикрепить файлы
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                            multiple
                        />
                    </Button>
                </Grid2>

                <Grid2 size={9}>
                    <FileListContainer elevation={1}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px', maxHeight: '100px', alignItems: 'center'}}>
                            {files.map((file, index) => (
                                <Chip
                                key={index}
                                label={`${file.name} (${formatFileSize(file.size)})`}
                                onDelete={() => handleRemoveFile(index)}
                                deleteIcon={<Close />}
                                variant="outlined"
                                color="primary"
                                sx={{ 
                                    maxWidth: '200px',
                                    '& .MuiChip-label': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    }
                                }}
                                />
                            ))}
                            {files.length === 0 && (
                                <Box sx={{ color: 'text.secondary'}}>
                                    Здесь будут отображаться прикрепленные файлы
                                </Box>
                            )}
                        </Box>
                    </FileListContainer>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={3} direction={'row'} paddingTop="15px" alignItems="left" justifyContent="left">
                <Grid2 size={3} >
                    <Button
                    variant="contained"
                    color="success"
                    size={'small'}
                    fullWidth={true}
                    disabled={!isFormValid}
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
            
        </DialogContent>
    </Dialog>
    
    </div>
  );
}
