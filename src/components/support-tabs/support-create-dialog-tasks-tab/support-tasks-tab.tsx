import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { RedirectTaskDialog, PostponeTaskDialog, PostponeData, formatFIO } from '../../../components';
import { NewTaskDialog } from '../../newTask-dialog/newTask-dialog';

import dayjs from 'dayjs';

import { components } from '../../../types/api';
import { useTasks } from '../../../hooks/useTaskMutations';
import { useUpdateOrder } from '../../../hooks/useOrderMutations';

type OrderTask = components['schemas']['TaskResponseDTO'];

type Order = components['schemas']['OrderResponseDTO'];

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

    const indent = level * 220;
    const isSelected = selectedNode?.idOrderTask === node.idOrderTask;

    /*
    return (
      <Box
        key={node.idOrderTask}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: `0px 0px 0px ${level}px`,
        }}
      >
        {level > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: indent - 26,
              top: -20,
              width: 26,
              height: 50,
              borderLeft: '2px solid #bdbdbd',
              borderBottom: '2px solid #bdbdbd',
              borderBottomLeftRadius: '10px',
            }}
          />
        )}

        <Paper
          onClick={() =>
            onNodeSelect(
              isSelected ? null : node
            )
          }
          sx={{
            position: 'relative',
            textAlign: 'center',
            ml: level === 0 ? 0 : 4,
            mb: 2,
            p: 1,
            minWidth: 200,
            cursor: 'pointer',
            color: 'white',
            backgroundColor: blockColor(node),
            border: '2px solid',
            borderColor: blockColor(node),
            transition: '0.2s',

            boxShadow: '0 0px 15px rgba(0,0,0,0.2)',

            '&:hover': {
              backgroundColor: hoverColor(node),
              boxShadow: '0 0px 15px rgba(0,0,0,0.3)',
            },
            margin: `0px 0px 20px ${indent}px `

          }}
        >
          <Typography variant="body1">
            {formatFIO(node.executorFio || '')}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {dayjs(node.dateCreated).format(
              'DD.MM.YYYY HH:mm'
            )}
          </Typography>
        </Paper>

        {children.length > 0 && children.length < 2 && (
          <Box
            sx={{
              position: 'relative',
            }}
          >
            {children
              .sort(
                (a, b) =>
                  new Date(a.dateCreated).getTime() -
                  new Date(b.dateCreated).getTime()
              )
              .map(child =>
                renderNode(child, level + 1)
              )}
          </Box>
        )}

        {children.length > 1 && (
          <Box
            sx={{
              position: 'relative',

              '&::before': {
                content: '""',
                position: 'absolute',
                left: indent + 25 + level,
                top: 20,
                bottom: 63,
                borderLeft: '2px solid #bdbdbd',
              },
            }}
          >
            {children
              .sort(
                (a, b) =>
                  new Date(a.dateCreated).getTime() -
                  new Date(b.dateCreated).getTime()
              )
              .map(child =>
                renderNode(child, level + 1)
              )}
          </Box>
        )}
      </Box>
    );
    */
    return (
      <Box
        key={node.idOrderTask}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: `0px 0px 0px ${level}px`,
        }}
      >
        {/* Линия к элементу */}
        {level > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: indent - 130,
              top: 20,
              width: 130,
              height: 10,
              borderLeft: '2px solid #bdbdbd',
              borderBottom: '2px solid #bdbdbd',
              borderBottomLeftRadius: '10px',
            }}
          />
        )}

        {/* Карточка */}
        <Paper
          onClick={() =>
            onNodeSelect(
              isSelected ? null : node
            )
          }
          sx={{
            position: 'relative',
            textAlign: 'center',
            ml: level === 0 ? 0 : 4,
            mb: 2,
            p: 1,
            minWidth: 200,
            cursor: 'pointer',
            color: 'white',
            backgroundColor: blockColor(node),
            border: '2px solid',
            borderColor: blockColor(node),
            transition: '0.2s',

            boxShadow: '0 0px 15px rgba(0,0,0,0.2)',

            '&:hover': {
              backgroundColor: hoverColor(node),
              boxShadow: '0 0px 15px rgba(0,0,0,0.3)',
            },
            margin: `0px 0px -20px ${indent}px `

          }}
        >
          <Typography variant="body1">
            {formatFIO(node.executorFio || '')}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {dayjs(node.dateCreated).format(
              'DD.MM.YYYY HH:mm'
            )}
          </Typography>
        </Paper>

        {/* Дети */}
        {children.length > 0 && children.length < 2 && (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {children
              .sort(
                (a, b) =>
                  new Date(a.dateCreated).getTime() -
                  new Date(b.dateCreated).getTime()
              )
              .map(child =>
                renderNode(child, level + 1)
              )}
          </Box>
        )}

        {children.length > 1 && (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: indent + 91 + level,
                top: 20,
                bottom: 20,
                borderLeft: '2px solid #bdbdbd',
              },
            }}
          >
            {children
              .sort(
                (a, b) =>
                  new Date(a.dateCreated).getTime() -
                  new Date(b.dateCreated).getTime()
              )
              .map(child =>
                renderNode(child, level + 1)
              )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {data.filter(node => node.orderTaskParentId === null)
        .sort((a, b) =>
          new Date(a.dateCreated).getTime() -
          new Date(b.dateCreated).getTime()
        )
        .map(node => renderNode(node))}
    </Box>
  );
};

// Основная функция
export function SupportTasksTab({ order }: SupportTasksTabProps) {
  // Состояния компонентов
  const [selectedNode, setSelectedNode] = useState<OrderTask | null>(null);
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [subTaskDialogOpen, setSubTaskDialogOpen] = useState(false);
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false);

  const { data: tasks = [] } = useTasks();
  const { mutate: updateOrderMutate } = useUpdateOrder();

  let orderTasks = tasks;
  orderTasks = orderTasks.filter((item: OrderTask) => (item.orderId === order?.idOrder));

  const handleNodeSelect = (node: OrderTask | null) => {
    setSelectedNode(node);
  };

  const handleCreateClick = () => {
    setNewTaskDialogOpen(true);
  };

  const handleSubTaskClick = () => {
    setSubTaskDialogOpen(true);
  }

  const handleRedirectClick = () => {
    if (selectedNode) {
      setRedirectDialogOpen(true);
    }
  };

  const handlePostponeClick = () => {
    setPostponeDialogOpen(true);
  };

  const handlePostponeSave = (data: PostponeData) => {
    if (!order?.idOrder) return;
    updateOrderMutate(
      {
        id: order.idOrder,
        data: {
          datePostpone: data?.datePostpone,
          comment: `${order.comment}\nЗАЯВКА ОТЛОЖЕНА\nПричина: ${data?.comment}`,
        },
      },
    );
    setPostponeDialogOpen(false);
  };

  const handleNewTaskClose = () => {
    setNewTaskDialogOpen(false);
  }

  const handleSubTaskClose = () => {
    setSubTaskDialogOpen(false);
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

          <Button
            variant="contained"
            color="inherit"
            size="small"
            sx={{
              flex: '1 1 auto', minWidth: '120px'
            }}
            onClick={handleSubTaskClick}
            disabled={!selectedNode}
          >
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
            Отложить заявку
          </Button>
          {/*TODO: Реализовать работу закрытия задачи*/}
          <Button variant="contained" color="success" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
            Закрыть задачу
          </Button>
        </Box>

        {/* Блок-схема */}
        <Box
          sx={{
            height: '50vh',
            maxWidth: '157.5vh',
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

      <NewTaskDialog
        currOrder={order}
        idParent={selectedNode?.idOrderTask}
        open={subTaskDialogOpen}
        onClose={handleSubTaskClose}
      />

      <RedirectTaskDialog
        currTask={selectedNode}
        open={redirectDialogOpen}
        onClose={handleRedirectClose}
      />

      <PostponeTaskDialog
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
        onSave={handlePostponeSave}
      />
    </div>
  );
}