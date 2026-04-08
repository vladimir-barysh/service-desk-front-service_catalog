import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { RedirectTaskDialog, RedirectData, PostponeTaskDialog, PostponeData, formatFIO } from '../../../components';
import { Order } from '../../../pages/support/makeData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, getTasks } from '../../../api/services/taskService';
import { OrderTask } from '../../../api';
import dayjs from 'dayjs';
import { useUpdateTask } from '../../../api/hooks/useTask';
import { NewTaskDialog } from '../../newTask-dialog/newTask-dialog';
import { AxiosError } from 'axios';
import { showNotification } from '../../../context';
import { TaskCreateDTO } from '../../../api/dtos';

// Пропсы для компонентов
interface BlockSchemaProps {
  data: OrderTask[];
  selectedNode: OrderTask | null;
  onNodeSelect: (node: OrderTask | null) => void;
}

interface SupportTasksTabProps {
  order: Order | null;
}

// Функция для блок схемы
const BlockSchema = ({ data, selectedNode, onNodeSelect }: BlockSchemaProps) => {
  // Рекурсивная функция отрисовки узлов
  const renderNode = (node: OrderTask, level = 0) => {
    const indent = level * 100;
    const isSelected = selectedNode?.idOrderTask === node.idOrderTask;

    return (
      <Box key={node.idOrderTask} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        {/* Блок */}
        <Paper
          sx={{
            p: 1,
            minWidth: 200,
            textAlign: 'center',
            backgroundColor: isSelected ? 'primary.light' : 'primary.main',
            color: 'white',
            mb: 2,
            ml: `${indent}px`,
            cursor: 'pointer',
            border: '2px solid #1976d2',
            '&:hover': {
              backgroundColor: isSelected ? 'none' : 'primary.dark',
            }
          }}
          onClick={() => {
            // Если блок уже выбран, снимаем выделение, иначе выбираем
            if (isSelected) {
              onNodeSelect(null);
            } else {
              onNodeSelect(node);
            }
          }}
        >
          <Typography variant="body2">
            {formatFIO(node.executor?.fio1c || '')}
          </Typography>
        </Paper>

        {/* TODO: Дочерние элементы 
        {node.orderTaskParent && (
          <Box>
            {node.orderTaskParent.map(child => renderNode(child, level + 1))}
          </Box>
        )}*/}
      </Box>
    );
  };

  return (
    <Box>
      {data.map(node => renderNode(node))}
    </Box>
  );
};

// Основная функция
export function SupportTasksTab({ order }: SupportTasksTabProps) {
  // Состояния компонентов
  const [selectedNode, setSelectedNode] = useState<OrderTask | null>(null);
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation<any, AxiosError, TaskCreateDTO>({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Успех
      showNotification({ title: 'Успешно', message: 'Задача создана', color: 'green' });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      handleNewTaskClose();
    },
    onError: (error: any) => {
      showNotification({
        title: 'Ошибка',
        message: error?.response?.data?.message || error.message || 'Не удалось создать задачу',
        color: 'red'
      });
    },
  });

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

  let orderTasks = tasks;
  orderTasks = orderTasks.filter((item: OrderTask) => (item.order?.idOrder === order?.idOrder));

  const handleNodeSelect = (node: OrderTask | null) => {
    setSelectedNode(node);
  };

  const handleCreateNewTask = () => {
    if (selectedNode) {
      setNewTaskDialogOpen(true);
    }
  };

  const handleRedirectClick = () => {
    if (selectedNode) {
      setRedirectDialogOpen(true);
    }
  };

  const handlePostponeClick = () => {
    setPostponeDialogOpen(true);
  };

  const { mutate: updateTaskMutate, isPending } = useUpdateTask();

  const handleNewTaskCreate = async (idExecutor: number) => {
    
    const finPlan = dayjs(selectedNode?.dateFinishPlan).toISOString();
    console.log(finPlan);
    
    const dto: TaskCreateDTO = {
      idOrder: order?.idOrder,
      idOrderTaskParent: selectedNode?.idOrderTask,
      idWork: selectedNode?.work?.idWork,
      idExecutor: idExecutor, 
      dateFinishPlan: finPlan,
      description: selectedNode?.description,
      closeParentCheck: selectedNode?.closeParentCheck,
      idTaskState: selectedNode?.taskState?.idTaskState,
      idCreator: selectedNode?.creator?.idItUser
    };

    mutation.mutate(dto);

    handleNewTaskClose();
  };

  const handleRedirectSave = (data: RedirectData) => {
    console.log('Сохранение данных:', data);
    updateTaskMutate(
      {
        id: selectedNode?.idOrderTask,
        data: {
          idExecutor: data.to,
          description: data.reason,
        },
      },
    );
    console.log('Данные перенаправления:', data);
    setRedirectDialogOpen(false);
  };



  const handlePostponeSave = (data: PostponeData) => {
    console.log('Данные откладывания:', data);
    // Здесь обновляем request с новой датой
    if (order) {
      // request.postponeDate = data.postponeUntil; // Раскомментировать когда добавите поле в Request
    }
    setPostponeDialogOpen(false);
  };

  const handleNewTaskClose = () => {
    setNewTaskDialogOpen(false);
  }

  const handleRedirectClose = () => {
    setRedirectDialogOpen(false);
  };

  const handlePostponeClose = () => {
    setPostponeDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Верхние кнопки действий */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{
            flex: '1 1 auto', minWidth: '120px'
          }}
          onClick={handleCreateNewTask}
        >
          Создать задачу
        </Button>

        <Button variant="contained" color="inherit" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
          Создать подзадачу
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
          onClick={handleRedirectClick}
          disabled={!selectedNode}
        >
          Перенаправить задачу
        </Button>
        <Button
          variant="contained"
          color="warning"
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
          onClick={handlePostponeClick}
        >
          Отложить задачу
        </Button>
        <Button variant="contained" color="success" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
          Закрыть задачу
        </Button>
      </Box>

      {/* Блок-схема */}
      <BlockSchema
        data={orderTasks}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
      />

      <NewTaskDialog
        open={newTaskDialogOpen}
        onClose={handleNewTaskClose}
        onSave={handleNewTaskCreate}
      />

      {/* Диалог перенаправления задачи */}
      <RedirectTaskDialog
        open={redirectDialogOpen}
        onClose={handleRedirectClose}
        onSave={handleRedirectSave}
        currentExecutor={selectedNode?.executor?.fio1c || ''}
      />

      {/* Диалог откладывания задачи */}
      <PostponeTaskDialog
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
        onSave={handlePostponeSave}
      //currentDate={request?.dateFinishPlan} // Передаем текущую дату из request
      />

      {/* Вывод выбранного блока */}
      {selectedNode && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Выбран: {selectedNode.executor?.fio1c}
        </Typography>
      )}
    </Box>
  );
}