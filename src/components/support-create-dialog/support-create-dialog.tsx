import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Box,
  Button,
  Grid2,
  IconButton, DialogActions, DialogContentText
} from '@mui/material';

import { Close } from '@mui/icons-material';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AttachFileOutlined, PeopleAltOutlined, PriorityHighOutlined, LanOutlined } from '@mui/icons-material'
import { uploadedFiles } from '../support-tabs/support-create-dialog-files-tab/makeData';
import { seed } from '../support-tabs/support-create-dialog-discussion-tab/makeData'
import {
  SupportGeneralTab, SupportApproveTab, SupportDiscussionTab,
  SupportFilesTab, SupportHistoryTab, SupportTasksTab
} from '../support-tabs';
import { useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getTasks } from '../../api/services/taskService';
import { components } from '../../types/api';
import { useUpdateOrder } from '../../hooks/useOrder';
import { useTasks } from '../../hooks/useTaskMutations';
import { useApprovesByOrder } from '../../hooks/useApprove';

type Order = components['schemas']['OrderResponseDTO'];
type OrderTask = components['schemas']['TaskResponseDTO'];

interface SupportGeneralDialogProps {
  isOpen: boolean;
  request: Order | null;
  disabled: boolean;
  onClose: () => void;
}

export function SupportGeneralDialog({ isOpen, request, disabled, onClose }: SupportGeneralDialogProps) {
  const [value, setValue] = useState('1');
  const [hasFiles, setHasFiles] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [hasTasks, setHasTasks] = useState(false);
  const [hasApproves, setHasApproves] = useState(false);

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
  const isEditing = !editableRequest?.orderStateName?.includes('Закрыта');              // флаг режима редактирования

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { data: tasks = [] } = useTasks();
  const { data: approves = [], isLoading: approvesLoading, error: approvesError } = useApprovesByOrder(request?.idOrder ?? 0);
    
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
    if (!request?.nomer) return;
    const filesForThisRequest = uploadedFiles.filter(
     file => file.idRequest === request.nomer
    );
    setHasFiles(filesForThisRequest.length > 0);
  };

  const checkMessages = () => {
    if (!request?.nomer) return;
    const messagesForThisRequest = seed.filter(
      message => message.idRequest === String(request.nomer)
    );
    setHasMessages(messagesForThisRequest.length > 0);
  };

  const checkTasks = () => {
    if (!request?.nomer) return;
    const tasksForThisOrder = tasks.filter(
      (task: OrderTask) => task.orderNomer === request.nomer
    );
    setHasTasks(tasksForThisOrder.length > 0);
  };

  const checkApproves = () => {
    if (!request?.nomer) return;
    
    setHasTasks(approves.length > 0);
  };

  useEffect(() => {
    checkFiles();
    checkMessages();
    checkTasks();
    checkApproves();
  }, [request]);

  const { mutate: updateOrderMutate, isPending } = useUpdateOrder();

  const handleSave = async () => {
    if (!generalData?.idOrder) return;
    const safeToIso = (value: any): string => {
      if (!value) return '';
      const d = dayjs(value);
      return d.isValid() ? d.toISOString().split('.')[0] + 'Z' : '';
    };
    updateOrderMutate(
      {
        id: generalData.idOrder,
        data: {
          name: generalData?.name,
          description: generalData?.description,
          dateFinishPlan: safeToIso(generalData?.dateFinishPlan),
          datePostpone: safeToIso(generalData?.datePostpone),
          dateTechReturn: safeToIso(generalData?.dateTechReturn),
          idOrderType: generalData?.orderTypeId,
          idService: generalData?.serviceId,
          idOrderPriority: generalData?.orderPriorityId,
          idOrderState: generalData?.orderStateId,
          idDispatcher: generalData?.dispatcherId,
          idOrderSource: generalData?.orderSourceId,
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
      >
        <DialogContent sx={{ minHeight: '60vh', minWidth: '75vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>

            <Box fontSize='18px' fontWeight='700'>
              {request?.orderTypeName} №{request?.nomer}
            </Box>

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
                <Tab label="Согласование" icon={hasApproves ? <PriorityHighOutlined /> : undefined} iconPosition='end' value="3" />
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
                disabled={disabled}
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
              <SupportApproveTab order={request} />
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color='red' alignContent='center'>
          Внимание!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color='black'>
            У вас есть несохраненные изменения. Хотите сохранить их перед закрытием?
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