import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Box,
  Button,
  Grid2,
  Chip,
  Paper,
  IconButton, DialogActions, DialogContentText
} from '@mui/material';

import { Close } from '@mui/icons-material';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AttachFileOutlined, PeopleAltOutlined, PriorityHighOutlined, LanOutlined } from '@mui/icons-material'
import { Order } from '../../api/models';
import { fileDataClass, uploadedFiles } from '../support-tabs/support-create-dialog-files-tab/makeData';
import { seed } from '../support-tabs/support-create-dialog-discussion-tab/makeData'
import {
  SupportGeneralTab, SupportCoordinationTab, SupportDiscussionTab,
  SupportFilesTab, SupportHistoryTab, SupportTasksTab
} from '../support-tabs';
import { updateOrder } from '../../api/services/orderService';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query'
import { OrderUpdateDTO } from '../../api/dtos';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useUpdateOrder } from '../../api/hooks/useUpdateOrder';
import dayjs from 'dayjs';

interface SupportGeneralDialogProps {
  isOpen: boolean;
  request: Order | null;

  onClose: () => void;
}

export function SupportGeneralDialog({ isOpen, request, onClose }: SupportGeneralDialogProps) {
  const [value, setValue] = useState('1');
  const [hasFiles, setHasFiles] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  // Состояния для каждого таба
  const [generalData, setGeneralData] = useState(request);
  const [filesData, setFilesData] = useState<any[]>([]);
  const [discussionData, setDiscussionData] = useState<any[]>([]);

  // Флаги изменений для каждого таба
  const [generalChanged, setGeneralChanged] = useState(false);
  const [filesChanged, setFilesChanged] = useState(false);
  const [discussionChanged, setDiscussionChanged] = useState(false);

  // Общий флаг изменений
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(generalChanged || filesChanged || discussionChanged);
  }, [generalChanged, filesChanged, discussionChanged]);

  const [editableRequest, setEditableRequest] = useState<Order | null>(request);
  const isEditing = !editableRequest?.orderState?.name?.includes('Закрыта');              // флаг режима редактирования

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClose = () => {
    if (hasChanges) {
      setOpenConfirmDialog(true);
      return; // Не закрываем основной диалог
    }
    setValue("1");
    onClose();
  };

  const handleConfirmClose = (shouldSave: boolean) => {
    setOpenConfirmDialog(false);

    if (shouldSave) {
      // Сохраняем изменения
      handleSave();
    }

    // В любом случае закрываем основной диалог
    setValue("1");
    onClose();
  };

  const handleCancelClose = () => {
    setOpenConfirmDialog(false);
    // Оставляем основной диалог открытым
  };

  // Функция для проверки файлов по ID заявки
  const checkFiles = () => {
    if (!request?.nomer) {
      setHasFiles(false);
      return;
    }

    // Ищем файлы, у которых idRequest совпадает с id заявки
    const filesForThisRequest = uploadedFiles.filter(
      file => file.idRequest === request.nomer
    );

    if (filesForThisRequest.length > 0) {
      setHasFiles(true);
    }
    else {
      setHasFiles(false);
    }

  };

  const checkMessages = () => {
    if (!request?.nomer) {
      setHasMessages(false);
      return;
    }

    // Ищем файлы, у которых idRequest совпадает с id заявки
    const messagesForThisRequest = seed.filter(
      message => message.idRequest === request.nomer
    );

    if (messagesForThisRequest.length > 0) {
      setHasMessages(true);
    }
    else {
      setHasMessages(false);
    }

  };

  useEffect(() => {
    checkFiles();
    checkMessages();
  }, [request]);

  const { mutate: updateOrderMutate, isPending } = useUpdateOrder();

  const handleSave = async () => {
    console.log('Сохранение данных:', generalData);
    const safeToIso = (value: any): string => {
      if (!value) return '';

      const d = dayjs(value);
      return d.isValid() ? d.toISOString() : '';
    };
    updateOrderMutate(
      {
        id: generalData?.idOrder,
        data: {
          name: generalData?.name,
          description: generalData?.description,
          dateFinishPlan: safeToIso(generalData?.dateFinishPlan),
          datePostpone: safeToIso(generalData?.datePostpone),
          idService: generalData?.service?.idService,
          idOrderType: generalData?.orderType?.idOrderType,
          idOrderState: generalData?.orderState?.idOrderState,
          idOrderPriority: generalData?.orderPriority?.idOrderPriority,
          resultText: generalData?.resultText,
          comment: generalData?.comment,
        },
      },
    );
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditableRequest(request); // Возвращаем оригинальные данные
    setGeneralData(request);
    setFilesData([]);
    setDiscussionData([]);
    setGeneralChanged(false);
    setFilesChanged(false);
    setDiscussionChanged(false);
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth='xl'
      >
        <DialogContent sx={{ minHeight: '60vh', minWidth: '75vh' }}>
          <Grid2 container spacing={0} direction={'row'} alignItems="left" justifyContent="space-between">
            <Grid2 size='auto'>
              <Box fontSize='20px' fontWeight='700'>
                Заявка №{request?.nomer || ''}
              </Box>
            </Grid2>
            {/* Крестик */}
            <Grid2 size='auto'>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid2>
          </Grid2>
          <TabContext value={value}>
            <TabList onChange={handleChange} centered>
              <Tab label="Общие сведения" value="1" />
              <Tab label="Файлы" icon={hasFiles ? <AttachFileOutlined /> : undefined} iconPosition='end' value="2" />
              <Tab label="Согласование" icon={<PriorityHighOutlined />} iconPosition='end' value="3" />
              <Tab label="Задачи" icon={<LanOutlined />} iconPosition='end' value="4" />
              <Tab label="Обсуждение" icon={hasMessages ? <PeopleAltOutlined /> : undefined} iconPosition='end' value="5" />
              <Tab label="История" value="6" />
            </TabList>
            <TabPanel value="1" sx={{ padding: "0px" }}>
              <SupportGeneralTab
                isOpen={true}
                request={request}
                onUpdate={(data, hasChanges) => {
                  setGeneralData(data);
                  setGeneralChanged(hasChanges);
                }}
              />
            </TabPanel>
            <TabPanel value="2" sx={{ padding: "0px" }}>
              <SupportFilesTab request={request} />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: "0px" }}>
              <SupportCoordinationTab order={request} />
            </TabPanel>
            <TabPanel value="4" sx={{ padding: "0px" }}>
              <SupportTasksTab request={request} />
            </TabPanel>
            <TabPanel value="5" sx={{ padding: "0px" }}>
              <SupportDiscussionTab request={request} />
            </TabPanel>
            <TabPanel value="6" sx={{ padding: "0px" }}>
              <SupportHistoryTab />
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions
          sx={{
            margin: '0px 15px 15px 0px',
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={!hasChanges}
            onClick={handleSave}
            sx={{ minWidth: '100px' }}
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleCancel}
            sx={{ minWidth: '100px' }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color='red' alignContent='center'>
          Внимание!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color='black'>
            У вас есть несохраненные изменения, хотите сохранить их перед закрытием?
          </DialogContentText>
        </DialogContent>
        <Grid2 size='auto' sx={{ margin: '0px 0px 20px 0px', display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleConfirmClose(true)}
            sx={{ minWidth: '100px' }}
            autoFocus
          >
            Да
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => handleConfirmClose(false)}
            sx={{ minWidth: '100px' }}
          >
            Нет
          </Button>
        </Grid2>
      </Dialog>
    </div>


  );
}