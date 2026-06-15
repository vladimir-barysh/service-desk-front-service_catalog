import { useState } from 'react';
import { Box, Button, Typography, Paper, IconButton, Grid2, Collapse, Divider } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import {
  formatFIO, TASK_STATES,
  RedirectTaskDialog, PostponeOrderTaskDialog,
  CloseDeclineOrderTaskDialog, NewTaskDialog,
  TaskInfoDialog
} from '../../../components';
import dayjs from 'dayjs';

import { useTasks } from '../../../hooks/useTask';

import { components } from '../../../types/api';
import { TextInputField } from '../../text-input-field';
type OrderTask = components['schemas']['TaskResponseDTO'];
type Order = components['schemas']['OrderResponseDTO'];

interface BlockSchemaProps {
  data: OrderTask[];
  selectedNode: OrderTask | null;
  onNodeSelect: (node: OrderTask | null) => void;
}

interface SupportTasksTabProps {
  order: Order | null;
}

const newTask = 'rgb(0, 98, 255)';
const newFocus = 'rgb(130, 174, 255)';
const newHover = 'rgb(0, 79, 226)';
const newText = 'rgb(255, 255, 255)';
const newTextFocus = 'rgb(0, 69, 197)';
const newDate = 'rgba(255, 255, 255, 0.75)';
const newDateFocus = 'rgba(0, 69, 197, 0.75)';

const inWorkTask = 'rgb(228, 228, 228)';
const inWorkFocus = 'rgb(228, 228, 228)';
const inWorkHover = 'rgb(204, 204, 204)';
const inWorkText = 'rgb(0, 0, 0)';
const inWorkTextFocus = 'rgb(0, 0, 0)';
const inWorkDate = 'rgba(48, 48, 48, 0.75)';
const inWorkDateFocus = 'rgba(48, 48, 48, 0.75)';

const pendingTask = 'rgb(255, 171, 74)';
const pendingFocus = 'rgb(255, 207, 153)';
const pendingHover = 'rgb(233, 124, 0)';
const pendingText = 'rgb(255, 255, 255)';
const pendingTextFocus = 'rgb(214, 114, 0)';
const pendingDate = 'rgba(255,255,255,0.75)';
const pendingDateFocus = 'rgba(214, 114, 0, 0.75)';

const closedTask = 'rgb(150, 245, 153)';
const closedFocus = 'rgb(150, 245, 153)';
const closedHover = 'rgb(130, 214, 133)';
const closedText = 'rgb(0, 187, 6)';
const closedTextFocus = 'rgb(0, 187, 6)';
const closedDate = 'rgba(0, 187, 6, 0.75)';
const closedDateFocus = 'rgba(0, 187, 6, 0.75)';

const BlockSchema = ({ data, selectedNode, onNodeSelect }: BlockSchemaProps) => {

  const { data: tasks = [] } = useTasks();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoTask, setInfoTask] = useState<OrderTask | null>(null);

  const blockColor = (block: OrderTask) => {
    const state = block.taskStateName;

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case TASK_STATES.NEW:
          return newFocus;
        case TASK_STATES.IN_WORK:
          return inWorkFocus;
        case TASK_STATES.PENDING:
          return pendingFocus;
        case TASK_STATES.CLOSED:
          return closedFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case TASK_STATES.NEW:
        return newTask;
      case TASK_STATES.IN_WORK:
        return inWorkTask;
      case TASK_STATES.PENDING:
        return pendingTask;
      case TASK_STATES.CLOSED:
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
      case TASK_STATES.NEW:
        return newHover;
      case TASK_STATES.IN_WORK:
        return inWorkHover;
      case TASK_STATES.PENDING:
        return pendingHover;
      case TASK_STATES.CLOSED:
        return closedHover;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const textColor = (block: OrderTask) => {
    const state = block.taskStateName;
    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case TASK_STATES.NEW:
          return newTextFocus;
        case TASK_STATES.IN_WORK:
          return inWorkTextFocus;
        case TASK_STATES.PENDING:
          return pendingTextFocus;
        case TASK_STATES.CLOSED:
          return closedTextFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case TASK_STATES.NEW:
        return newText;
      case TASK_STATES.IN_WORK:
        return inWorkText;
      case TASK_STATES.PENDING:
        return pendingText;
      case TASK_STATES.CLOSED:
        return closedText;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const dateColor = (block: OrderTask) => {
    const state = block.taskStateName;

    if (selectedNode?.idOrderTask === block.idOrderTask) {
      switch (state) {
        case TASK_STATES.NEW:
          return newDateFocus;
        case TASK_STATES.IN_WORK:
          return inWorkDateFocus;
        case TASK_STATES.PENDING:
          return pendingDateFocus;
        case TASK_STATES.CLOSED:
          return closedDateFocus;
        default:
          return 'hsla(0, 88%, 72%, 1.00)';
      }
    }

    switch (state) {
      case TASK_STATES.NEW:
        return newDate;
      case TASK_STATES.IN_WORK:
        return inWorkDate;
      case TASK_STATES.PENDING:
        return pendingDate;
      case TASK_STATES.CLOSED:
        return closedDate;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  /* Если нужно отдельное окно
  const handleInfoClick = (e: React.MouseEvent, task: OrderTask) => {
    e.stopPropagation();
    setInfoTask(task);
    setIsInfoOpen(true);
  }
    */

  const handleInfoClose = () => {
    setInfoTask(null);
    setIsInfoOpen(false);
  }

  // Рекурсивная функция отрисовки узлов
  const renderNode = (node: OrderTask, level = 0, expandedOffset = 0) => {
    const children = tasks.filter(
      item => item.orderTaskParentId === node.idOrderTask
    );

    const isExpanded = selectedNode?.idOrderTask === node.idOrderTask;
    
    const indent = level * 220 + expandedOffset;

    const childOffset = expandedOffset + (isExpanded ? 350 : 0);
    
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
        {/* Нижняя линия */}
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
              isExpanded ? null : node
            )
          }
          sx={{
            position: 'relative',
            textAlign: 'left',
            ml: level === 0 ? 0 : 4,
            mb: 2,
            p: 1,
            pl: 2,
            pr: 2,
            minWidth: 200,
            cursor: 'pointer',
            backgroundColor: blockColor(node),
            transition: '0.2s',
            borderStyle: node?.taskStateName === TASK_STATES.IN_WORK ? 'solid' : 'none',
            borderColor: 'rgb(177, 177, 177)',
            borderWidth: 1,
            boxShadow: selectedNode?.idOrderTask === node.idOrderTask ? 'inset 0 0px 5px rgba(0,0,0,0.5)' : '0 1px 15px rgba(0,0,0,0.2)',

            '&:hover': {
              backgroundColor: hoverColor(node),
              boxShadow: selectedNode?.idOrderTask === node.idOrderTask ? 'inset 0 0px 5px rgba(0,0,0,0.5)' : '0 0px 15px rgba(0,0,0,0.3)',
            },
            margin: `0px 0px -20px ${indent}px`,
            zIndex: 1,

          }}
        >
          <Grid2 container flexDirection='row' justifyContent='space-between'>
            <Grid2 container flexDirection='column'>
              <Typography
                variant='body1'
                sx={{
                  color: textColor(node),
                  textDecoration: node.taskStateName === TASK_STATES.CLOSED ? 'line-through' : 'none',
                }}
              >
                {formatFIO(node.executorFio || '')}

              </Typography>

              <Typography
                variant='body2'
                sx={{
                  color: dateColor(node),
                  textDecoration: node.taskStateName === TASK_STATES.CLOSED ? 'line-through' : 'none',
                }}
              >
                {dayjs(node.dateCreated).format(
                  'DD.MM.YYYY HH:mm'
                )}
              </Typography>
            </Grid2>

            {isExpanded && (
              <Typography
                variant="body1"
                sx={{ mt: 1, color: textColor(node), }}
              >
                {node.taskStateName}
              </Typography>
            )}
            {/*
            <IconButton
              sx={{
                color: textColor(node)
              }}
              onClick={(e) => handleInfoClick(e, node)}
            >
              <InfoOutlined />
            </IconButton>
            */}
          </Grid2>

          {isExpanded && (
            <Box
              sx={{
                padding: '5px 10px 5px 10px',
                borderTop: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '5px',
                backgroundColor: 'rgb(255 255 255)',
                boxShadow: `inset 0 0px 10px ${blockColor(node)}`
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <Grid2
                container
                spacing={8}
                paddingBottom="5px"
                justifyContent="center"
              >

                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ЖЕЛАЕМЫЙ СРОК</Typography>
                  <Typography>
                    {node?.dateFinishPlan !== null ? dayjs(node?.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '-'}
                  </Typography>
                </Grid2>


                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ОТЛОЖЕНО ДО</Typography>
                  <Typography>{node?.datePostpone !== null ? dayjs(node?.datePostpone).format('DD.MM.YYYY HH:mm') : '-'}</Typography>
                </Grid2>

                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ДАТА РЕШЕНИЯ</Typography>
                  <Typography>
                    {node?.dateFinishFact !== null ? dayjs(node?.dateFinishFact).format('DD.MM.YYYY HH:mm') : '-'}
                  </Typography>
                </Grid2>

              </Grid2>

              <Divider />

              <Grid2
                container
                spacing={5}
                paddingBottom="5px"
                justifyContent="center"
                margin='10px 0px 10px 0px'
              >
                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>СОЗДАТЕЛЬ ЗАДАЧИ</Typography>
                  <Typography>{formatFIO(node?.executorFio || '')}</Typography>
                </Grid2>

                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>№ ЗАЯВКИ</Typography>
                  <Typography>{node?.orderId}</Typography>
                </Grid2>

                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>№ РОДИТЕЛЬСКОЙ ЗАДАЧИ</Typography>
                  <Typography>{node?.orderTaskParentId || '-'}</Typography>
                </Grid2>

              </Grid2>

              <Divider />

              <Grid2
                container
                spacing={0}
                flexDirection='column'
                justifyContent="center"
                margin='10px 0px 0px 0px'
              >

                <Grid2 margin='0px 0px 10px 0px'>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ЗАКРЫВАТЬ РОДИТЕЛЬСКУЮ ЗАДАЧУ?</Typography>
                  <Typography>{node?.closeParentCheck !== null ? (node?.closeParentCheck === true ? 'Да' : 'Нет') : '-'}</Typography>
                </Grid2>

                <Grid2 margin='0px 0px 10px 0px'>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ОПИСАНИЕ</Typography>
                  <TextInputField
                    value={node?.description || '-'}
                    rows={3}
                    readOnly={true}
                  />
                </Grid2>

                <Grid2>
                  <Typography color='rgb(180, 180, 180)' variant='subtitle2'>РЕЗУЛЬТАТ</Typography>
                  <TextInputField
                    value={node?.resultText || '-'}
                    rows={1}
                    readOnly={true}
                  />
                </Grid2>

              </Grid2>
            </Box>
          )}
        </Paper>

        {children.length === 1 && (
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
                renderNode(child, level + 1, childOffset)
              )}
          </Box>
        )}
        {/* Левая линия */}
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
                left: isExpanded === true ? indent + 91 + level + childOffset : indent + 91 + level,
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
                renderNode(child, level + 1, childOffset)
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

      <TaskInfoDialog
        task={infoTask}
        open={isInfoOpen}
        onClose={handleInfoClose}
      />
    </div>
  );
};

export function SupportTasksTab({ order }: SupportTasksTabProps) {

  const [selectedNode, setSelectedNode] = useState<OrderTask | null>(null);

  const [subTaskDialogOpen, setSubTaskDialogOpen] = useState(false);
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const { data: tasks = [] } = useTasks();

  let orderTasks = tasks;
  orderTasks = orderTasks.filter((item: OrderTask) => (item.orderId === order?.idOrder));

  const handleNodeSelect = (node: OrderTask | null) => {
    setSelectedNode(node);
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
    if (selectedNode) {
      setCloseDialogOpen(true);
    }
  };

  const handleSubTaskClose = () => {
    setSubTaskDialogOpen(false);
  }

  const handleRedirectClose = () => {
    setRedirectDialogOpen(false);
  };

  const handlePostponeClose = () => {
    setPostponeDialogOpen(false);
  };

  const handleCloseClose = () => {
    setCloseDialogOpen(false);
  }

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        sx={{ mt: 2, minHeight: '57vh' }}
      >

        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>

          <Button
            variant="contained"
            color='info'
            size="small"
            sx={{
              flex: '1 1 auto', minWidth: '120px', minHeight: '40px', backgroundColor: 'rgb(0, 98, 255)'
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
            sx={{ flex: '1 1 auto', minWidth: '120px', backgroundColor: 'rgb(255, 136, 0)' }}
            onClick={handlePostponeClick}
            disabled={!selectedNode}
          >
            Отложить задачу
          </Button>
          <Button
            variant="contained"
            color='success'
            size="small"
            sx={{
              flex: '1 1 auto',
              minWidth: '120px', backgroundColor: 'rgb(0, 207, 7)'
            }}
            onClick={handleCloseClick}
            disabled={!selectedNode}
          >
            Закрыть задачу
          </Button>
        </Box>

        <Box
          sx={{
            height: '65vh',
            maxWidth: '157.5vh',
            backgroundColor: 'rgb(240, 240, 240)',
            backgroundImage: 'radial-gradient(circle, rgba(168, 168, 168, 0.25) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
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
            backgroundColor: inWorkTask,
            borderRadius: '2px',
          }} />
          <Typography>- в работе</Typography>
          <Paper sx={{
            width: 14,
            height: 14,
            backgroundColor: pendingTask,
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
        idParent={selectedNode?.idOrderTask}
        open={subTaskDialogOpen}
        onClose={handleSubTaskClose}
      />

      <RedirectTaskDialog
        currTask={selectedNode}
        open={redirectDialogOpen}
        onClose={handleRedirectClose}
      />

      <PostponeOrderTaskDialog
        task={selectedNode}
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
      />

      <CloseDeclineOrderTaskDialog
        task={selectedNode}
        closeOrDecline='close'
        open={closeDialogOpen}
        onClose={handleCloseClose}
      />
    </div>
  );
}