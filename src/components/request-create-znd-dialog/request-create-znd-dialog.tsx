import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Dialog, DialogContent,
  DialogActions, Box,
  Button, Grid2,
  IconButton,
  TextField, InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Input, Text, CloseButton, Radio, Group, Checkbox,
} from '@mantine/core';
import {
  AlternateEmail, Close, PhoneOutlined,
} from '@mui/icons-material';
import { DateTimePicker } from '@mantine/dates';
import { ChooseServiceCreateDialog } from '../itservice-choose';

import {
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
import { showNotification } from './../../context';

import { usePodrs } from '../../hooks/usePodr';
import { useUsers } from '../../hooks/useUser';
import { useCreateOrder } from '../../hooks/useOrder';

import { components } from '../../types/api';
type Service = components['schemas']['ServResponseDTO'];
type User = components['schemas']['UserResponseDTO'];
type Podr = components['schemas']['PodrResponseDTO'];
type OrderCreateDTO = components['schemas']['OrderCreateRequestDTO'];

export const RequestCreateZNDDialog = (props: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const labelStyle = {
    margin: '0px 0px -15px 0px',
  };

  const [error, setError] = useState<string | undefined>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [chosen, setChosen] = React.useState<Service | null>(null);

  const [comment, setComment] = useState('');
  const [sDate, setSDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [selected, setSelected] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  const [reqType, setReqType] = useState<string>('');
  const [accessType, setAccessType] = useState<string>('');
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const isFormValid = useMemo(() => {
    let dateChoose = true;
    if (checked) {
      sDate !== null && toDate !== null ? dateChoose = true : dateChoose = false;
    }
    return (
      reqType !== '' &&
      chosen !== null &&
      selected !== null &&
      accessType !== '' &&
      Object.keys(rowSelection).length > 0 &&
      dateChoose
    );
  }, [reqType, chosen, selected, accessType, rowSelection, checked, sDate, toDate]);

  const isDataValid = useMemo(() => {
    return (checked && sDate && toDate && sDate > toDate)
      ? (setError('Некорректно указан срок доступа'), false)
      : true;

  }, [checked, sDate, toDate]);

  const { data: users = [] } = useUsers();
  const { data: podrs = [] } = usePodrs();

  const podrSelected = useMemo(() => {
    if (!selected?.podrId) return null;
    return podrs.find((p: Podr) => p.idPodr === selected?.podrId);
  }, [podrs, selected]);

  const { mutate: createOrderMutation } = useCreateOrder();

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
    setRowSelection({});
    setComment('');
    setSDate(null);
    setToDate(null);
    props.onClose();
  };

  const handleSave = () => {
    if (!isDataValid) {
      showNotification({
        title: 'Проверьте введенные данные',
        message: error,
        color: 'orange',
      });
      return;
    }

    /*
      Менять строки, относящиеся к description, АККУРАТНО так как от них зависит конечное форматирование описания ЗНД
    */
    const name = `${reqType} к ${chosen?.fullname || ''}. ${selected?.fio1c || ''}`;
    const description = `Прошу ${reqType === 'Предоставить/изменить доступ' ? 'предоставить' : 'закрыть'} доступ к ${chosen?.fullname}.
Пользователю: ${selected?.fio1c}
( ${selected?.dolzh1c || 'не указан'}, ${selected?.podrId || 'не указан'}, Почта: ${selected?.emailAd || 'не указан'}, Телефон: ${selected?.telAd || 'не указан'} )
Доступ: ${accessType}
Роль: ${Object.keys(rowSelection).map((rowId) => data.find((role) => String(role.id) === rowId)?.roleName).join(', ') || 'не указана'}
Фиксрованный срок доступа: ${checked ? `${sDate?.toLocaleString()} - ${toDate?.toLocaleString()}` : 'не ограничен'}
Держатель сервиса: ${chosen?.developer}`
    //Пока что указывается разработчик сервиса ^

    if (!chosen) {
      showNotification({
        title: 'Выберите сервис',
        color: 'orange',
      });
      return;
    }

    const dto: OrderCreateDTO = {
      name: name,
      idService: chosen.idService,
      idCatItem: 1,
      idInitiator: 1,
      idOrderType: 1,
      description: description,

      comment: comment
    };

    //const formData = new FormData();
    //formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    createOrderMutation(dto, {
      onSuccess: () => handleClose(),
    });
  };

  const handleReqTypeChange = (value: string) => {
    setReqType(value);
  };
  const handleAccessTypeChange = (value: string) => {
    setAccessType(value);
  };

  const handleDispatcherChange = (id: number | null) => {

    const selectedObject = users.find(
      (item: User) => item.idItUser === id
    ) ?? null;
    setSelected(selectedObject);
  };

  const handleSChange = (date: Date) => {
    setSDate(date);
  };

  const handleToChange = (date: Date) => {
    setToDate(date);
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
        onSelect={(service: Service | null) => {
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
              <Text fw={600}>Вид заявки *</Text>
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
                <Text fw={600}>Кому доступ *</Text>
              </Grid2>
              <Grid2 size="auto">
                <Autocomplete
                  fullWidth
                  size="small"
                  options={users}
                  value={
                    users.find((x: User) => x.idItUser === selected?.idItUser) || null
                  }
                  onChange={(_, newValue) => {
                    handleDispatcherChange(newValue?.idItUser || null);
                  }}
                  getOptionLabel={(option: User) => option.fio1c || ''}
                  isOptionEqualToValue={(option, value) =>
                    option.idItUser === value.idItUser
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Не выбран"
                    />
                  )}
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
                  value={podrSelected?.name || ''}
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
                minDate={new Date()}
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
                minDate={new Date()}
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
              <Text fw={600}>Уровень доступа *</Text>
            </Grid2>
            <Radio.Group
              value={accessType}
              onChange={handleAccessTypeChange}
              withAsterisk
            >
              <Group>
                <Radio fw={200} label="Чтение" value="Чтение" />
                <Radio fw={200} label="Запись" value="Запись" />
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
