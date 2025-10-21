import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid2,
  Box,
} from '@mui/material';
import { Input, Select } from '@mantine/core';

export const ItcatalogWorktypeCreateDialog = (props: {
  isOpen: boolean;
  departmentName: string;
  worktypeName: string;
  groupName: string;
  note: string;
  onClose: any;
}) => {

  const handleClose = () => {
    props.onClose();
  };
  const department_data: string[] = ['АО "Алтайэнергосбыт"', 'Транспорт электроэнергии', 'Отдел взаимодействия с ТСО', 'Отдел сопровождения учетных процессов', 'Отдел налоговой эспертизы', 'Финансовая группа']
  const worktype_data: string[] = ['Предоставление доступа', 'Добавление в группу для отображения базы в списке', 'Изменение квоты']
  const group_data: string[] = ['Администратор', '1С: Предприятие', 'Личный кабинет', 'АСУСЭ', 'ОРЭМ', 'Казна']

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Редактирование типа работы</DialogTitle>
      <DialogContent sx={{minHeight: '40vh', minWidth: '40vh'}}>
        <DialogContentText>

        </DialogContentText>
        <Input.Wrapper label="Подразделение">
          <Select
            size="xs"
            data={department_data}
            defaultValue={props.departmentName}
            maxDropdownHeight={170}
            searchable={true}
            clearable={true}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Тип работы" withAsterisk>
          <Select
            size="xs"
            data={worktype_data}
            defaultValue={props.worktypeName}
            maxDropdownHeight={140}
            searchable={true}
            clearable={true}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Группа" withAsterisk>
          <Select
            size="xs"
            data={group_data}
            defaultValue={props.groupName}
            maxDropdownHeight={170}
            searchable={true}
            clearable={true}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Примечание" >
          <Input size="xs"/>
        </Input.Wrapper>
        <Box height={200} width={500} sx={{display: 'flex', alignItems: 'flex-end'}}>
          <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="center" flex={2}>
            <Grid2 size={4} >
              <Button
                variant="contained"
                color="primary"
                size={'small'}
                fullWidth={true}
              >
                Сохранить
              </Button>
            </Grid2>
            <Grid2 size={4} offset={{md:3}}>
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
          </Grid2>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
