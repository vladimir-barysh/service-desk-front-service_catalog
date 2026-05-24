import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { RedirectTaskDialog, RedirectData, PostponeTaskDialog, PostponeData, formatFIO } from '../../../components';
import { NewTaskDialog } from '../../newTask-dialog/newTask-dialog';
import { showNotification } from '../../../context';

import dayjs from 'dayjs';

import { components } from '../../../types/api';
import { useTasks, useCreateTask, useUpdateTask } from '../../../hooks/useTaskMutations';

type OrderTask = components['schemas']['TaskResponseDTO'];

type Order = components['schemas']['OrderResponseDTO'];
type User = components['schemas']['UserResponseDTO'];

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
  const blockColor = (block: OrderTask) => {

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    const state = block.taskStateName;

    switch (state) {
      case 'Новая':
        return 'rgb(0, 207, 7)';
      case 'ЗНД':
        return 'rgba(255, 152, 0, 0.1)';
      case 'ЗНИ':
        return 'rgba(244, 67, 54, 0.1)';
      case 'ЗНТ':
        return 'rgba(54, 82, 244, 0.1)';
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const hoverColor = (block: OrderTask) => {

    const state = block.taskStateName;

    switch (state) {
      case 'Новая':
        return 'rgb(50, 100, 52)';
      case 'ЗНД':
        return 'rgba(255, 152, 0, 0.1)';
      case 'ЗНИ':
        return 'rgba(244, 67, 54, 0.1)';
      case 'ЗНТ':
        return 'rgba(54, 82, 244, 0.1)';
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const { data: tasks = [] } = useTasks();

  // Рекурсивная функция отрисовки узлов
  const renderNode = (node: OrderTask, level = 0) => {

    const children = tasks.filter(
      item => item.orderTaskParentId === node.idOrderTask
    );

    const indent = level * 100;
    const isSelected = selectedNode?.idOrderTask === node.idOrderTask;

    return (
      <Box
        key={node.idOrderTask}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          ml: level * 4,

        }}
      >
        <Paper
          sx={{
            p: 1,
            minWidth: 200,
            textAlign: 'center',
            backgroundColor: blockColor(node),
            color: 'white',
            mb: 2,
            ml: `${indent}px`,
            cursor: 'pointer',
            border: '2px solid',
            borderColor: blockColor(node),
            '&:hover': {
              backgroundColor: hoverColor(node),
            },
            boxShadow: '0 0px 15px rgba(0,0,0,0.2)'
          }}
          onClick={() => {
            if (isSelected) {
              onNodeSelect(null);
            } else {
              onNodeSelect(node);
            }
          }}
        >
          <Typography variant="body1">
            {formatFIO(node.executorFio || '')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgb(119, 119, 119)' }}>
            {dayjs(node.dateCreated).format('DD.MM.YYYY HH:mm')}
          </Typography>
        </Paper>

        {children.length > 0 && (
          <Box>
            {children.map(child => renderNode(child, level + 1))}
          </Box>
        )}
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


  const { mutate: updateTaskMutate } = useUpdateTask();

  const { data: tasks = [] } = useTasks();

  let orderTasks = tasks;
  orderTasks = orderTasks.filter((item: OrderTask) => (item.orderId === order?.idOrder));

  const handleNodeSelect = (node: OrderTask | null) => {
    setSelectedNode(node);
  };

  const handleCreateClick = () => {
    setNewTaskDialogOpen(true);
  };

  const handleRedirectClick = () => {
    if (selectedNode) {
      setRedirectDialogOpen(true);
    }
  };

  const handlePostponeClick = () => {
    setPostponeDialogOpen(true);
  };

  const handleRedirectSave = (data: RedirectData) => {
    /*
    updateTaskMutate(
      {
        id: selectedNode?.idOrderTask,
        data: {
          idExecutor: data.to,
          description: data.reason,
        },
      },
    );
    setRedirectDialogOpen(false);
    */
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
    <div>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        sx={{ mt: 2, minHeight: '57vh' }}
      >
        {/* Верхние кнопки */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              flex: '1 1 auto', minWidth: '120px'
            }}
            onClick={handleCreateClick}
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
        <Box
          sx={{
            backgroundColor: 'rgb(240, 240, 240)',
            flexGrow: 1,
            overflow: 'auto',
            borderRadius: '10px',
            p: '15px 10px 10px 15px',
            boxShadow: `inset 0 1px 3px rgba(0,0,0,0.12),
                        inset 0 -1px 3px rgba(0,0,0,0.08)`
          }}
        >
          <BlockSchema
            data={orderTasks}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
        </Box>

        {/* Вывод выбранного блока */}
        {selectedNode && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Выбран: {selectedNode.executorFio}
          </Typography>
        )}

        {/* Обозначения */}
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
          mt="auto"
        >
          <Typography>Цвета задач:</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: 'rgb(0, 207, 7)',
            borderRadius: '2px',
          }} />
          <Typography>- новая</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: 'rgb(50, 100, 52)',
            borderRadius: '2px',
          }} />
          <Typography>- новая</Typography>
        </Box>
      </Box>



      <NewTaskDialog
        currOrder={order}
        open={newTaskDialogOpen}
        onClose={handleNewTaskClose}
      />

      <RedirectTaskDialog
        open={redirectDialogOpen}
        onClose={handleRedirectClose}
        onSave={handleRedirectSave}
        currentExecutor={selectedNode?.executorFio || ''}
      />

      <PostponeTaskDialog
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
        onSave={handlePostponeSave}
      //currentDate={request?.dateFinishPlan} // Передаем текущую дату из request
      />
    </div>
  );
}