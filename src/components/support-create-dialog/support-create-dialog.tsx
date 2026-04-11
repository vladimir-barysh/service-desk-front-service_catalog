import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Box,
  Button,
  IconButton, DialogActions, DialogContentText
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AttachFileOutlined, PeopleAltOutlined, PriorityHighOutlined, LanOutlined, Close } from '@mui/icons-material'
import { Order, OrderTask } from '../../api/models';
import { uploadedFiles } from '../support-tabs/support-create-dialog-files-tab/makeData';
import { seed } from '../support-tabs/support-create-dialog-discussion-tab/makeData'
import {
  SupportGeneralTab, SupportCoordinationTab, SupportDiscussionTab,
  SupportFilesTab, SupportHistoryTab, SupportTasksTab
} from '../support-tabs';
import { useQuery} from '@tanstack/react-query';
import { useUpdateOrder } from '../../api/hooks/useOrder';
import dayjs from 'dayjs';
import { getTasks } from '../../api/services/taskService';

interface SupportGeneralDialogProps {
  isOpen: boolean;
  request: Order | null;

  onClose: () => void;
}

export function SupportGeneralDialog({ isOpen, request, onClose }: SupportGeneralDialogProps) {
  const [value, setValue] = useState('1');
  const [hasFiles, setHasFiles] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [hasTasks, setHasTasks] = useState(false);

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

  const {
      data: tasks = [],
      isLoading,
      error,
    } = useQuery({
      queryKey: ['tasks'],
      queryFn: getTasks,
      enabled: true,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    });
    
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

  const checkTasks = () => {
    if (!request?.nomer) {
      setHasTasks(false);
      return;
    }

    const tasksForThisOrder = tasks.filter(
      (task: OrderTask) => task.order?.nomer === request.nomer
    );

    if (tasksForThisOrder.length > 0) {
      setHasTasks(true);
    }
    else {
      setHasTasks(false);
    }

  };

  useEffect(() => {
    checkFiles();
    checkMessages();
    checkTasks();
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
        maxWidth='xl'
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
          }
        }}
      >
        <DialogContent sx={{ minHeight: '60vh', minWidth: '75vh', display: 'flex', flexDirection: 'column'}}>
          {/* Верхняя строка: номер заявки, вкладки, крестик */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box fontSize='18px' fontWeight='700'>
              Заявка №{request?.nomer || ''}
            </Box>

            {/* TabList – вкладки */}
            <TabContext value={value}>
              <TabList 
                onChange={handleChange} 
                centered 
                variant="scrollable" 
                scrollButtons="auto" 
                sx={{
                  minHeight: '36px',
                  '& .MuiTab-root': {
                    minHeight: '36px',
                  },
                }}
              >
                <Tab label="Общие сведения" value="1" />
                <Tab label="Файлы" icon={hasFiles ? <AttachFileOutlined /> : undefined} iconPosition='end' value="2" />
                <Tab label="Согласование" icon={<PriorityHighOutlined />} iconPosition='end' value="3" />
                <Tab label="Задачи" icon={hasTasks ? <LanOutlined /> : undefined} iconPosition='end' value="4" />
                <Tab label="Обсуждение" icon={hasMessages ? <PeopleAltOutlined /> : undefined} iconPosition='end' value="5" />
                <Tab label="История" value="6" />
              </TabList>
            </TabContext>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <TabContext value={value}>
            <TabPanel value="1" sx={{ padding: "0px", flexGrow: 1 }}>
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
              <SupportFilesTab order={request} />
            </TabPanel>
            <TabPanel value="3" sx={{ padding: "0px" }}>
              <SupportCoordinationTab order={request} />
            </TabPanel>
            <TabPanel value="4" sx={{ padding: "0px" }}>
              <SupportTasksTab order={request} />
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
            Назад
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ color: 'warning.main', textAlign: 'center' }}>
          Внимание! У вас есть несохранённые изменения
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description" align="center">
            Что вы хотите сделать?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleConfirmClose(true)}
            autoFocus
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleCancelClose}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleConfirmClose(false)}
          >
            Не сохранять
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}