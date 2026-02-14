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
    IconButton,
    Typography,
    DialogActions,
} from '@mui/material';
import { Input, Textarea, Text, CloseButton } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

import { notifications } from '@mantine/notifications';

import { ChooseServiceCreateDialog } from '../itservice-choose';
import { Service } from '../../api/models';

import { TextInputField } from '../text-input-field';

import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query'
import axios from '../../api/axios';
import { OrderCreateDTO } from '../../api/dtos';
import { AxiosError } from 'axios';
import { createOrder } from '../../api/services/orderService';

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
    const [chosen, setChosen] = React.useState<Service | null>(null);

    const [problemDescription, setProblemDescription] = useState('');
    const [comment, setComment] = useState('');

    const queryClient = useQueryClient();
    const mutation = useMutation<OrderCreateDTO, AxiosError, OrderCreateDTO>({
        mutationFn: createOrder,
        onSuccess: (newOrder) => {
            // Успех
            notifications.show({
                title: 'Успешно',
                message: 'ЗНО зарегистрировано',
                color: 'green',
                autoClose: 4000,
                withCloseButton: true,
                withBorder: false,
                loading: false,
                styles: (theme) => ({
                    root: {
                        backgroundColor: theme.colors.green[6],
                        borderColor: theme.colors.green[6],
                    },
                    title: { color: theme.white },
                    description: { color: theme.white },
                    closeButton: {
                        color: theme.white,
                        '&:hover': { backgroundColor: theme.colors.green[6] },
                    },
                }),
            });

            queryClient.invalidateQueries({ queryKey: ['orders'] });

            handleClose(); // закрываем диалог
            // можно сбросить форму
            setChosen(null);
            setProblemDescription('');
            setComment('');
            //setFiles([]);
        },
        onError: (error: any) => {
            notifications.show({
                title: 'Ошибка',
                message: error?.response?.data?.message || error.message || 'Не удалось создать заявку',
                color: 'red',
                autoClose: 4000,
                withCloseButton: true,
                withBorder: false,
                loading: false,
                styles: (theme) => ({
                    root: {
                        backgroundColor: theme.colors.red[6],
                        borderColor: theme.colors.red[6],
                    },
                    title: { color: theme.white },
                    description: { color: theme.white },
                    closeButton: {
                        color: theme.white,
                        '&:hover': { backgroundColor: theme.colors.red[8] },
                    },
                }),
            });
        },
    });

    const isFormValid = useMemo(() => {
        return (
            chosen !== null &&
            problemDescription.trim() !== ''
        );
    }, [chosen, problemDescription]);

    function CreateDialog() {
        setIsCreateDialogOpen(true);
    }
    const onCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    };

    const handleClose = () => {
        setChosen(null);
        setProblemDescription('');
        setComment('');
        setFiles([]);
        props.onClose();
    };

    const handleSave = async () => {
        console.log('chosen', chosen);
        console.log('chosenId', chosen?.idService);
        if (!isFormValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const payload = {
            name: 'Второй заголовок',
            description: problemDescription,
            dateFinishPlan: '',
            idService: chosen?.idService,
            idOrderType: 3,
        };

        // Отправляем
        mutation.mutate(payload);

        handleClose();
    };

    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles((prev) => [...prev, ...newFiles]);
        }
        event.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
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
                onSelect={(service: any) => {
                    setChosen(service);
                }}
            />
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogContent
                    sx={{ minHeight: '45vh', minWidth: '75vh', padding: '20x' }}
                >
                    <Grid2
                        container
                        spacing={0}
                        direction={'row'}
                        alignItems="left"
                        justifyContent="space-between"
                    >
                        <Grid2 size="auto">
                            <Box fontSize="25px" fontWeight="700">
                                Регистрация ЗНО
                            </Box>
                        </Grid2>

                        <Grid2 size="auto">
                            <IconButton onClick={handleClose}>
                                <Close />
                            </IconButton>
                        </Grid2>
                    </Grid2>
                    <Box
                        fontSize="15px"
                        fontWeight="500"
                        marginBottom="10px"
                        sx={{ color: 'error.main' }}
                    >
                        Пункты с * обязательны к заполнению
                    </Box>

                    <Grid2
                        container
                        spacing={1}
                        direction={'row'}
                        padding="5px 0px 5px 0px"
                        justifyContent="space-between"
                    >
                        <Grid2 container spacing={1} alignItems="center" size="auto">
                            <Grid2 size="auto">
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

                            <Grid2 size="auto">
                                <Input.Wrapper>
                                    <Input
                                        variant="filled"
                                        value={chosen?.fullname ?? ''}
                                        readOnly
                                        rightSection={
                                            <CloseButton
                                                aria-label="Clear input"
                                                onClick={() => setChosen(null)}
                                                style={{ display: chosen ? undefined : 'none' }}
                                            />
                                        }
                                    />
                                </Input.Wrapper>
                            </Grid2>
                        </Grid2>

                        <Grid2 container spacing={1} alignItems="center" size="auto">
                            <Grid2 size="auto">
                                <Text fw={600}>Желаемый срок:</Text>
                            </Grid2>
                            <Grid2 size="auto">
                                <DateTimePicker
                                    placeholder="ДД.MM.ГГ ЧЧ:ММ"
                                    valueFormat="DD.MM.YYYY HH:mm"
                                    withSeconds={false}
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                    clearable
                                    locale="ru"
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>

                    <Grid2
                        container
                        spacing={1}
                        direction="column"
                        margin="0px 0px 10px 0px"
                    >
                        <Grid2 size="auto">
                            <Text fw={600}>Подробное описание проблемы *</Text>
                        </Grid2>
                        <Grid2 size="auto">
                            <TextInputField
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                                rows={3}
                            />
                        </Grid2>
                    </Grid2>

                    <Grid2
                        container
                        spacing={1}
                        direction="column"
                        margin="0px 0px 10px 0px"
                    >
                        <Grid2 size="auto">
                            <Text fw={600}>Комментарий</Text>
                        </Grid2>
                        <Grid2 size="auto">
                            <TextInputField
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={2}
                            />
                        </Grid2>
                    </Grid2>

                    <Grid2
                        container
                        spacing={3}
                        direction={'row'}
                        paddingTop="15px"
                        alignItems="left"
                        justifyContent="left"
                    >
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 1,
                                        minHeight: '40px',
                                        maxHeight: '100px',
                                        alignItems: 'center',
                                    }}
                                >
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
                                                },
                                            }}
                                        />
                                    ))}
                                    {files.length === 0 && (
                                        <Box sx={{ color: 'text.secondary' }}>
                                            Здесь будут отображаться прикрепленные файлы
                                        </Box>
                                    )}
                                </Box>
                            </FileListContainer>
                        </Grid2>
                    </Grid2>


                </DialogContent>
                <DialogActions
                    sx={{
                        margin: '0px 15px 10px 0px',
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'bottom'
                    }}
                >
                    <Grid2 size={3}>
                        <Button
                            variant="contained"
                            color="success"
                            size={'small'}
                            fullWidth={true}
                            disabled={!isFormValid || mutation.isPending}
                            onClick={handleSave}
                        >
                            {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
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
                </DialogActions>
            </Dialog>
        </div>
    );
};
