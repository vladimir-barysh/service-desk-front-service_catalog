import { useState } from 'react';
import { Box, Button, Typography, Paper, IconButton, Grid2 } from '@mui/material';
import { RedirectTaskDialog, PostponeTaskDialog, formatFIO } from '../../../components';
import { NewTaskDialog } from '../../newTask-dialog/newTask-dialog';
import { showNotification } from '../../../context';
import dayjs from 'dayjs';

import { useTasks, useUpdateTask } from '../../../hooks/useTaskMutations';
import { useStates } from '../../../hooks/useStateMutations';

import { components } from '../../../types/api';
import { Info, InfoOutlined } from '@mui/icons-material';
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

const newTask = 'rgb(0, 207, 7)';
const newFocus = 'rgb(150, 245, 153)';
const newHover = 'rgb(0, 187, 6)';
const newText = 'rgb(255, 255, 255)';
const newTextFocus = 'rgb(0, 187, 6)';
const newDate = 'rgba(255, 255, 255, 0.75)';
const newDateFocus = 'rgba(0, 187, 6, 0.75)';

const onWaitTask = 'rgb(255, 136, 0)';
const onWaitFocus = 'rgb(255, 207, 153)';
const onWaitHover = 'rgb(233, 124, 0)';
const onWaitText = 'rgb(255, 255, 255)';
const onWaitTextFocus = 'rgb(214, 114, 0)';
const onWaitDate = 'rgba(255,255,255,0.75)';
const onWaitDateFocus = 'rgba(214, 114, 0, 0.75)';

const closedTask = 'rgb(231, 170, 166)';
const closedFocus = 'rgb(255, 222, 219)';
const closedHover = 'rgb(216, 163, 159)';
const closedText = 'rgb(82, 82, 82)';
const closedTextFocus = 'rgb(185, 137, 134)';
const closedDate = 'rgba(107, 107, 107, 0.75)';
const closedDateFocus = 'rgba(185, 137, 134, 0.75)';

// Функция для блок схемы
const BlockSchema = ({ data, selectedNode, onNodeSelect }: BlockSchemaProps) => {

  const blockColor = (block: OrderTask) => {
    const state = block.taskStateName;

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case 'Новая':
          return newFocus;
        case 'В ожидании':
          return onWaitFocus;
        case 'Закрыта':
          return closedFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case 'Новая':
        return newTask;
      case 'В ожидании':
        return onWaitTask;
      case 'Закрыта':
        return closedTask;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const hoverColor = (block: OrderTask) => {

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      return;
    }

    const state = block.taskStateName;

    switch (state) {
      case 'Новая':
        return newHover;
      case 'В ожидании':
        return onWaitHover;
      case 'Закрыта':
        return closedHover;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const textColor = (block: OrderTask) => {
    const state = block.taskStateName;
    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case 'Новая':
          return newTextFocus;
        case 'В ожидании':
          return onWaitTextFocus;
        case 'Закрыта':
          return closedTextFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case 'Новая':
        return newText;
      case 'В ожидании':
        return onWaitText;
      case 'Закрыта':
        return closedText;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const dateColor = (block: OrderTask) => {
    const state = block.taskStateName;

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case 'Новая':
          return newDateFocus;
        case 'В ожидании':
          return onWaitDateFocus;
        case 'Закрыта':
          return closedDateFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case 'Новая':
        return newDate;
      case 'В ожидании':
        return onWaitDate;
      case 'Закрыта':
        return closedDate;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const { data: tasks = [] } = useTasks();

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInfoOpen(true);
  }

  const handleInfoClose = () => {
    setIsInfoOpen(false);
  }

  // Рекурсивная функция отрисовки узлов
  const renderNode = (node: OrderTask, level = 0) => {

    const children = tasks.filter(
      item => item.orderTaskParentId === node.idOrderTask
    );

    const indent = level * 220;
    const isSelected = selectedNode?.idOrderTask === node.idOrderTask;

    return (
      <Box
        key={node.idOrderTask}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: `0px 0px 0px ${level}px`
        }}
      >
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
              pointerEvents: 'none',
              zIndex: 0,
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
            textAlign: 'left',
            ml: level === 0 ? 0 : 4,
            mb: 2,
            p: 1,
            pl: 2,
            minWidth: 200,
            cursor: 'pointer',
            backgroundColor: blockColor(node),
            transition: '0.2s',

            boxShadow: selectedNode?.idOrderTask === node.idOrderTask ? 'inset 0 0px 5px rgba(0,0,0,0.5)' : '0 1px 15px rgba(0,0,0,0.2)',

            '&:hover': {
              backgroundColor: hoverColor(node),
              boxShadow: selectedNode?.idOrderTask === node.idOrderTask ? 'inset 0 0px 5px rgba(0,0,0,0.5)' : '0 0px 15px rgba(0,0,0,0.3)',
            },
            margin: `0px 0px -20px ${indent}px `,
            zIndex: 1,

          }}
        >
          <Grid2 container flexDirection='row' justifyContent='space-between'>
            <Grid2 container flexDirection='column'>
              <Typography
                variant="body1"
                sx={{
                  color: textColor(node),
                  textDecoration: node.taskStateName === 'Закрыта' ? 'line-through' : 'none',
                }}
              >
                {formatFIO(node.executorFio || '')}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: dateColor(node),
                  textDecoration: node.taskStateName === 'Закрыта' ? 'line-through' : 'none',
                }}
              >
                {dayjs(node.dateCreated).format(
                  'DD.MM.YYYY HH:mm'
                )}
              </Typography>
            </Grid2>
            <IconButton
              sx={{
                color: textColor(node)
              }}
              onClick={handleInfoClick}
            >
              <InfoOutlined />
            </IconButton>
          </Grid2>
        </Paper>

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
                pointerEvents: 'none',
                zIndex: 0,
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
    <div>
      <Box>
        {data.filter(node => node.orderTaskParentId === null)
          .sort((a, b) =>
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime()
          )
          .map(node => renderNode(node))}
      </Box>

      <NewTaskDialog
        currOrder={null}
        open={isInfoOpen}
        onClose={handleInfoClose}
      />
    </div>
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
  const { mutate: updateTaskMutate } = useUpdateTask();
  const { data: states = [] } = useStates();

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

  const handleCloseClick = () => {
    if (!selectedNode) {
      showNotification({
        title: 'Не указана задача',
        color: 'orange',
      });
      return;
    }
    const newState = states.find(state => state.name === 'Закрыта');
    updateTaskMutate(
      {
        id: selectedNode.idOrderTask,
        data: {
          idTaskState: newState?.idOrderState
        },
      },
    );
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

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {/* TODO: убрать или добавить кнопку */}
          {false && (
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                flex: '1 1 auto', minWidth: '120px'
              }}
              onClick={handleCreateClick}

            >
              Создать задачу
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{
              flex: '1 1 auto', minWidth: '120px', minHeight: '40px', backgroundColor: 'rgb(0, 207, 7)'
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
            sx={{ flex: '1 1 auto', minWidth: '120px'  }}
            onClick={handleRedirectClick}
            disabled={!selectedNode}
          >
            Перенаправить задачу
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            sx={{ flex: '1 1 auto', minWidth: '120px', backgroundColor: 'rgb(255, 136, 0)' }}
            onClick={handlePostponeClick}
            disabled={!selectedNode}
          >
            Отложить задачу
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              flex: '1 1 auto',
              minWidth: '120px', backgroundColor: 'rgb(255, 101, 91)'
            }} 
            onClick={handleCloseClick}
            disabled={!selectedNode}
          >
            Закрыть задачу
          </Button>
        </Box>

        {/* Блок-схема */}
        <Box
          sx={{
            height: '49vh',
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
          <Typography>Обозначения:</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: newTask,
            borderRadius: '2px',
          }} />
          <Typography>- новая</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: onWaitTask,
            borderRadius: '2px',
          }} />
          <Typography>- в ожидании</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: closedTask,
            borderRadius: '2px',
          }} />
          <Typography>- закрыта</Typography>
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
        currTask={selectedNode}
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
      />
    </div>
  );
}