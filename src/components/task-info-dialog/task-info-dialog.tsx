import React, { useState } from 'react';
import {
  Dialog, DialogContent,
  Box, Grid2,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { TextInputField } from '../text-input-field';
import { Close } from '@mui/icons-material';
import dayjs from 'dayjs';


import { components } from '../../types/api';
import { formatFIO, TASK_STATES } from '../usefulFuncsAndConsts';
type OrderTask = components['schemas']['TaskResponseDTO'];

interface TaskInfoDialogProps {
  task: OrderTask | null;
  idParent?: number;
  open: boolean;
  onClose: () => void;
}

const newTask = 'rgb(0, 207, 7)';
const newFocus = 'rgb(150, 245, 153)';
const newHover = 'rgb(0, 187, 6)';
const newText = 'rgb(255, 255, 255)';
const newTextFocus = 'rgb(0, 187, 6)';
const newDate = 'rgba(255, 255, 255, 0.75)';
const newDateFocus = 'rgba(0, 187, 6, 0.75)';

const inWorkTask = 'rgb(0, 89, 255)';
const inWorkFocus = 'rgb(130, 174, 255)';
const inWorkHover = 'rgb(0, 79, 226)';
const inWorkText = 'rgb(255, 255, 255)';
const inWorkTextFocus = 'rgb(0, 69, 197)';
const inWorkDate = 'rgba(255, 255, 255, 0.75)';
const inWorkDateFocus = 'rgba(0, 69, 197, 0.75)';

const pendingTask = 'rgb(255, 136, 0)';
const pendingFocus = 'rgb(255, 207, 153)';
const pendingHover = 'rgb(233, 124, 0)';
const pendingText = 'rgb(255, 255, 255)';
const pendingTextFocus = 'rgb(214, 114, 0)';
const pendingDate = 'rgba(255,255,255,0.75)';
const pendingDateFocus = 'rgba(214, 114, 0, 0.75)';

const closedTask = 'rgb(231, 170, 166)';
const closedFocus = 'rgb(255, 222, 219)';
const closedHover = 'rgb(216, 163, 159)';
const closedText = 'rgb(82, 82, 82)';
const closedTextFocus = 'rgb(185, 137, 134)';
const closedDate = 'rgba(107, 107, 107, 0.75)';
const closedDateFocus = 'rgba(185, 137, 134, 0.75)';

export function TaskInfoDialog({ task, idParent, open, onClose }: TaskInfoDialogProps) {
  const [description, setDescription] = useState('');

  const handleClose = () => {
    onClose();
  };

  const backColor = (state: string) => {
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
  }

  const textColor = (state: string) => {
    switch (state) {
      case TASK_STATES.NEW:
        return newText;
      case TASK_STATES.IN_WORK:
        return inWorkText
      case TASK_STATES.PENDING:
        return pendingText;
      case TASK_STATES.CLOSED:
        return closedText;
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
    >

      <DialogContent sx={{ minHeight: '57vh', display: 'flex', flexDirection: 'column' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0 }}>

          <Box fontSize='18px' fontWeight='700'>
            Задача №{task?.idOrderTask} {' '}
            <Box
              component="span"
              fontWeight={400}
              bgcolor={backColor(task?.taskStateName || '')}
              padding='4px 5px 5px 5px'
              borderRadius='5px'
              color={textColor(task?.taskStateName || '')}
            >
              {task?.taskStateName}
            </Box>
          </Box>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>

        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2
          }}
        >
          <Grid2
            container
            spacing={0}
            paddingBottom="5px"
            justifyContent="center"
            margin='10px 0px 10px 0px'
          >

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ДАТА СОЗДАНИЯ</Typography>
              <Typography>{dayjs(task?.dateCreated).format('DD.MM.YYYY HH:mm')}</Typography>
            </Grid2>

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ЖЕЛАЕМЫЙ СРОК</Typography>
              <Typography>
                {task?.dateFinishPlan !== null ? dayjs(task?.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '-'}
              </Typography>
            </Grid2>


            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ОТЛОЖЕНО ДО</Typography>
              <Typography>{task?.datePostpone !== null ? dayjs(task?.datePostpone).format('DD.MM.YYYY HH:mm') : '-'}</Typography>
            </Grid2>

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ДАТА РЕШЕНИЯ</Typography>
              <Typography>
                {task?.dateFinishFact !== null ? dayjs(task?.dateFinishFact).format('DD.MM.YYYY HH:mm') : '-'}
              </Typography>
            </Grid2>

          </Grid2>

          <Divider />

          <Grid2
            container
            spacing={0}
            paddingBottom="5px"
            justifyContent="center"
            margin='10px 0px 10px 0px'
          >
            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>СОЗДАТЕЛЬ ЗАДАЧИ</Typography>
              <Typography>{formatFIO(task?.executorFio || '')}</Typography>
            </Grid2>

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ИСПОЛНИТЕЛЬ</Typography>
              <Typography>{formatFIO(task?.creatorFio || '')}</Typography>
            </Grid2>

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>№ ЗАЯВКИ</Typography>
              <Typography>{task?.orderId}</Typography>
            </Grid2>

            <Grid2 size={3}>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>№ РОДИТЕЛЬСКОЙ ЗАДАЧИ</Typography>
              <Typography>{task?.orderTaskParentId || '-'}</Typography>
            </Grid2>

          </Grid2>

          <Divider />

          <Grid2
            container
            spacing={0}
            flexDirection='column'
            margin='10px 0px 0px 0px'
          >

            <Grid2 margin='0px 0px 10px 0px'>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ЗАКРЫВАТЬ РОДИТЕЛЬСКУЮ ЗАДАЧУ?</Typography>
              <Typography>{task?.closeParentCheck !== null ? (task?.closeParentCheck === true ? 'Да' : 'Нет') : '-'}</Typography>
            </Grid2>

            <Grid2 margin='0px 0px 10px 0px'>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>ОПИСАНИЕ</Typography>
              <TextInputField
                value={task?.description || '-'}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                readOnly={true}
              />
            </Grid2>

            <Grid2>
              <Typography color='rgb(180, 180, 180)' variant='subtitle2'>РЕЗУЛЬТАТ</Typography>
              <TextInputField
                value={task?.resultText || '-'}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                readOnly={true}
              />
            </Grid2>

          </Grid2>
        </Box>
      </DialogContent>
    </Dialog>
  );
}