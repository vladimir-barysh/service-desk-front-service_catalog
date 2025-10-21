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


export const RoleCreateDialog = (props: {
  isOpen: boolean;
  departmentName: string;
  roleName: string;
  userName: string;
  onClose: any;
}) => {

  const handleClose = () => {
    props.onClose();
  };
  const department_data: string[] = ['АО "Алтайэнергосбыт"', 'Транспорт электроэнергии', 'Отдел взаимодействия с ТСО', 'Отдел сопровождения учетных процессов', 'Отдел налоговой эспертизы', 'Финансовая группа']
  const role_data: string[] = ['Куратор от ИТ', 'Сервис-менеджер', 'Функциональный заказчик', 'Исполнитель (роль)', 'Держатель сервиса', 'Подписавшиейся']
  const user_data: string[] = ['Титов Татьяна Викторовна', 'Суханов Максим Владимирович', 'Мелихова Марина Вячеславовна', 'Тимошенко Николай Александрович', 'Гусев Алексей Сергеевич', 'Петров Александр Аркадьевич']

  return (
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
    >
      <DialogTitle>Редактирование роли</DialogTitle>
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
        <Input.Wrapper label="Роль" withAsterisk>
          <Select
            size="xs"
            data={role_data}
            defaultValue={props.roleName}
            maxDropdownHeight={140}
            searchable={true}
            clearable={true}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Пользователь" withAsterisk>
          <Select
            size="xs"
            data={user_data}
            defaultValue={props.userName}
            maxDropdownHeight={170}
            searchable={true}
            clearable={true}
          />
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
