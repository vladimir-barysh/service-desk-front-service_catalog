import React from 'react';
import { useState, useMemo } from 'react';
import {
  Dialog, DialogContent,
  DialogContentText, DialogTitle,
  DialogActions, Box,
  Button, Grid2,
  IconButton, Typography,
  TextField, InputAdornment,
  FormControl, MenuItem, Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Input, Textarea,
  Text, CloseButton,
  Radio, Group,
  Checkbox,
} from '@mantine/core';

import {
  AlternateEmail, Close,
  EmailOutlined, PhoneOutlined
} from '@mui/icons-material';

import { IconAt, IconPhone } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { ChooseServiceCreateDialog } from '../itservice-choose';
import { Service, User } from '../../api/models';

import { 
  employees, tableDataClass, 
  roles, rolesDataClass 
} from './makeData';

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

import { TextInputField } from '../text-input-field';

import { notifications } from '@mantine/notifications';

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query'
import { OrderCreateDTO } from '../../api/dtos';
import { AxiosError } from 'axios';
import { createOrder } from '../../api/services/orderService';
import { getUsers } from '../../api/services/userService';

export const RequestCreateZNDDialog = (props: {
  isOpen: boolean;
  onClose: any;
}) => {
  const labelStyle = {
    margin: '0px 0px -15px 0px',
  };
  const [value, setValue] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [chosen, setChosen] = React.useState<Service | null>(null);

  const [comment, setComment] = useState('');
  const [sDate, setSDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [selected, setSelected] = useState<User | null>(null);
  const [selectedName, setSelectedName] = useState<string | ''>('');
  const [search, setSearch] = useState('');
  const shouldFilterOptions = !employees.some(
    (item) => item.mainName?.toLowerCase() === search.toLowerCase().trim(),
  );
  const filteredEmployees = shouldFilterOptions
    ? employees.filter((item) =>
      item.mainName?.toLowerCase().includes(search.toLowerCase().trim()),
    )
    : employees;
  const employeeOptions = employees.map((emp) => ({
    value: emp.mainName || '',
    label: emp.mainName || '',
  }));
  const [checked, setChecked] = useState(false);

  //
  const [reqType, setReqType] = useState<string>('');
  const [accessType, setAccessType] = useState<string>('');
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const isFormValid = useMemo(() => {
    return (
      reqType !== '' &&
      chosen !== null &&
      selected !== null &&
      accessType !== '' &&
      Object.keys(rowSelection).length > 0
    );
  }, [reqType, chosen, selected, accessType, rowSelection]);

  const {
    data: users = [],
    isLoading: userLoad,
    error: userError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: Infinity
  });

  const queryClient = useQueryClient();
  const mutation = useMutation<any, AxiosError, FormData>({
    mutationFn: createOrder,
    onSuccess: (newOrder) => {
      // Успех
      notifications.show({
        title: 'Успешно',
        message: 'ЗНД зарегистрировано',
        color: 'green',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.green[6],
            borderColor: theme.colors.green[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.green[6] },
          },
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });

      handleClose();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Ошибка',
        message: error?.response?.data?.message || error.message || 'Не удалось создать заявку',
        color: 'red',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[8] },
          },
        }),
      });
    },
  });

  const columns = React.useMemo<MRT_ColumnDef<rolesDataClass>[]>(
    () => [
      {
        accessorKey: 'roleName',
        header: 'Профиль',
        size: 100,
        minSize: 20,
        maxSize: 100,
        Cell: ({ row }) => <Text>{row.original.roleName}</Text>,
      },
      {
        accessorKey: 'roleDescription',
        header: 'Описание',
        size: 600,
        Cell: ({ row }) => (
          <Text style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {row.original.roleDescription}
          </Text>
        ),
      },
    ],
    [],
  );
  const data = React.useMemo(() => roles, []);

  function CreateDialog() {
    setIsCreateDialogOpen(true);
  }
  const onCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleClose = () => {
    setChecked(false);
    setReqType('');
    setAccessType('');
    setChosen(null);
    setSelected(null);
    setSelectedName('');
    setRowSelection({});
    setComment('');
    props.onClose();
  };

  const handleSave = () => {
    if (!isFormValid) {
      notifications.show({
        title: 'Ошибка',
        message: 'Пожалуйста, заполните все обязательные поля',
        color: 'red',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[8] },
          },
        }),
      });
      return;
    }

    /*
      Запрещено менять строки, относящиеся к description, так как от них зависит конечное форматирование описания ЗНД
    */
    const name = `${reqType} к ${chosen?.fullname || ''}. ${selected?.fio1c || ''}`;
    const description = `Прошу ${reqType === 'Предоставить/изменить доступ' ? 'предоставить' : 'закрыть'} доступ к ${chosen?.fullname}.
Пользователю: ${selected?.fio1c}
( ${selected?.dolzh1c || 'не указан'}, ${selected?.podr?.name || 'не указан'}, Почта: ${selected?.emailAd || 'не указан'}, Телефон: ${selected?.telAd || 'не указан'} )
Доступ: ${accessType}
Роль: ${Object.keys(rowSelection).map((rowId) => data.find((role) => String(role.id) === rowId)?.roleName).join(', ') || 'не указана'}
Фиксрованный срок доступа: ${checked ? `${sDate} - ${toDate}` : 'не ограничен'}`

    const dto: OrderCreateDTO = {
      name: name,
      description: description,
      idService: chosen?.idService,
      idOrderType: 1,
      comment: comment,
    };

    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    mutation.mutate(formData);

    handleClose();
  };

  const handleReqTypeChange = (value: string) => {
    setReqType(value);
  };
  const handleAccessTypeChange = (value: string) => {
    setAccessType(value);
  };

  const handleDispatcherChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = users.find(
      (item: any) => item.idItUser === selectedId
    ) ?? null;
    setSelected(selectedObject);
    setSelectedName(selectedObject.fio1c);
  };

  const handleSChange = (date: Date | null) => {
    setSDate(date ? date.toLocaleDateString() : '');
  };

  const handleToChange = (date: Date | null) => {
    setToDate(date ? date.toLocaleDateString() : '');
  };

  const table = useMantineReactTable<rolesDataClass>({
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    localization: MRT_Localization_RU,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableRowNumbers: false,
    enableSorting: false,
    enableSelectAll: false,
    enableExpanding: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableBottomToolbar: false,
    positionToolbarAlertBanner: 'none',
    initialState: {
      expanded: true,
      density: 'xs',
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      style: { tableLayout: 'fixed' },
    },
    mantinePaperProps: { withBorder: true, shadow: 'xs' },
    mantineTableContainerProps: {
      style: {
        maxHeight: 150,
        overflowY: 'auto',
      },
    },
  });

  return (
    <div>
      <ChooseServiceCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={onCreateDialogClose}
        onSelect={(service: any) => {
          setChosen(service);
        }}
      />
      <Dialog
        open={props.isOpen}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogContent
          sx={{ minHeight: '60vh', minWidth: '75vh', padding: '20x' }}
        >
          <Grid2
            container
            spacing={0}
            direction={'row'}
            alignItems="left"
            justifyContent="space-between"
          >
            <Grid2 size="auto">
              <Box fontSize="25px" fontWeight="700">
                Регистрация ЗНД
              </Box>
            </Grid2>
            <Grid2 size="auto">
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid2>
          </Grid2>
          <Box fontSize="15px" fontWeight="500" sx={{ color: 'error.main' }}>
            Пункты с * обязательны к заполнению
          </Box>
          <Grid2
            container
            spacing={3}
            direction={'row'}
            alignItems="center"
            justifyContent="left"
            paddingTop="5px"
            paddingBottom="10px"
          >
            <Grid2 size={2}>
              <Text fw={600}>Вид заявки *:</Text>
            </Grid2>
            <Radio.Group
              value={reqType}
              onChange={handleReqTypeChange}
              withAsterisk
            >
              <Group>
                <Radio
                  fw={200}
                  label="Предоставить/изменить доступ"
                  value="Предоставить/изменить доступ"
                />

                <Radio fw={200} label="Закрыть доступ" value="Закрыть доступ" />
              </Group>
            </Radio.Group>
          </Grid2>
          <Grid2
            container
            spacing={3}
            direction={'row'}
            alignItems="left"
            justifyContent="left"
            paddingBottom="15px"
          >
            <Grid2 size={3}>
              <Button
                variant="contained"
                color="primary"
                size={'small'}
                fullWidth={true}
                onClick={CreateDialog}
              >
                Выберите ИТ-сервис *
              </Button>
            </Grid2>

            <Grid2 size={3}>
              <Input.Wrapper>
                <Input
                  variant="filled"
                  value={chosen?.fullname ?? ''}
                  readOnly
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setChosen(null)}
                      style={{ display: chosen ? undefined : 'none' }}
                    />
                  }
                />
              </Input.Wrapper>
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={2}
            direction={'row'}
            alignItems="center"
            justifyContent="center"
          >
            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Кому доступ*</Text>
              </Grid2>
              <Grid2 size="auto">
                <FormControl fullWidth size="small">
                  <Select
                    onChange={handleDispatcherChange}
                    renderValue={(selected) => {
                      if (!selected) return <em>Не выбрано</em>;
                      const p = users.find((x: any) => x.idItUser === selected);
                      return p?.fio1c;
                    }}
                  >
                    {users.map((item: any) => (
                      <MenuItem key={item.idItUser} value={item.idItUser}>
                        {item.fio1c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>

            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Email</Text>
              </Grid2>
              <Grid2 size="auto">
                <TextField
                  value={selected?.emailAd || ''}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <AlternateEmail />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={2}
            direction={'row'}
            alignItems="center"
            justifyContent="center"
          >
            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Должность</Text>
              </Grid2>
              <Grid2 size="auto">
                <TextField
                  value={selected?.dolzh1c || ''}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid2>
            </Grid2>

            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Сотовый телефон</Text>
              </Grid2>
              <Grid2 size="auto">
                <TextField
                  value={selected?.telAd || ''}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <PhoneOutlined />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={2}
            direction={'row'}
            alignItems="center"
            justifyContent="center"
          >
            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Подразделение</Text>
              </Grid2>
              <Grid2 size="auto">
                <TextField
                  value={selected?.podr?.name || ''}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              </Grid2>
            </Grid2>

            <Grid2
              container
              size={6}
              spacing={2}
              direction={'column'}
              alignItems="left"
              justifyContent="left"
              margin="0px 0px 0px 0px"
            >
              <Grid2 size="auto" sx={labelStyle}>
                <Text fw={600}>Внутренний телефон</Text>
              </Grid2>
              <Grid2 size="auto">
                <TextField
                  value={selected?.telAd || ''}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                    input: {
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <PhoneOutlined />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid2>
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={3}
            direction={'row'}
            alignItems="center"
            justifyContent="left"
            padding="10px 0px 10px 0px"
          >
            <Grid2 size={5}>
              <Checkbox
                fw={600}
                size="md"
                label="Требуется фиксированный срок доступа"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </Grid2>
            <Text fw={600}>с:</Text>
            <Grid2 size={2}>
              <DateTimePicker
                placeholder="ДД.MM.ГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"
                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale="ru"
                disabled={!checked}
                onChange={handleSChange}
              />
            </Grid2>
            <Text fw={600}>по:</Text>
            <Grid2 size={2}>
              <DateTimePicker
                placeholder="ДД.MM.ГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"
                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale="ru"
                disabled={!checked}
                onChange={handleToChange}
              />
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={3}
            direction={'row'}
            alignItems="center"
            justifyContent="left"
            paddingBottom="10px"
          >
            <Grid2 size={2}>
              <Text fw={600}>Уровень доступа *:</Text>
            </Grid2>
            <Radio.Group
              value={accessType}
              onChange={handleAccessTypeChange}
              withAsterisk
            >
              <Group>
                <Radio fw={200} label="Запись" value="Запись" />

                <Radio fw={200} label="Чтение" value="Чтение" />
              </Group>
            </Radio.Group>
          </Grid2>

          <Grid2
            container
            spacing={2}
            direction="row"
            alignItems="stretch"
            justifyContent="left"
            paddingBottom="5px"
          >
            <Grid2 size={12}>
              <MantineReactTable table={table} />
            </Grid2>
          </Grid2>

          <Grid2
            container
            spacing={1}
            direction="column"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto">
              <Text fw={600}>Комментарий</Text>
            </Grid2>
            <Grid2 size="auto">
              <TextInputField
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
              />
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions
          sx={{
            margin: '0px 15px 15px 0px',
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Grid2 size={3}>
            <Button
              variant="contained"
              color="success"
              size={'small'}
              fullWidth={true}
              disabled={!isFormValid}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </Grid2>
          <Grid2 size={3}>
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
        </DialogActions>

      </Dialog>
    </div>
  );
};
