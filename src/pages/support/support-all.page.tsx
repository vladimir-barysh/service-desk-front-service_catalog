import { useMemo, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable, type MRT_ColumnFiltersState } from 'mantine-react-table';
import { useSearchParams } from 'react-router-dom';
import { Grid2, Box } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import {
  SupportGeneralDialog, RequestCreateDialog,
  formatFIO, ControlDialog,
  PostponeDialog, RequestCreateZNODialog,
  RequestCreateZNDDialog, RequestCreateZNIDialog,
  RequestCreateZNTDialog
} from '../../components';
import SplitButton from '../../components/split-button/split-button.component';
import { useDialogs } from '../../components/support-hooks/use-dialog-state';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useOrders, useUpdateOrder, useUpdateOrderStatus } from '../../hooks/useOrder';
import { getOrderStates, getUsers } from '../../api'; // пока оставляем старые, но можно заменить позже
import { components } from '../../types/api';
import * as XLSX from 'xlsx';
import { showNotification } from '../../context';

export function SupportAllPage() {
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogZNIOpen, setIsCreateDialogZNIOpen] = useState(false);
  const [isCreateDialogZNTOpen, setIsCreateDialogZNTOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  
  type Order = components['schemas']['OrderResponseDTO'];
  type User = components['schemas']['UserResponseDTO'];

  const currUser = "Воронин Владимир Владимирович";

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status') || null;

  const { data: orders = [], isLoading, error } = useOrders();

  // Получение всех статусов заявок
  const { data: orderStates } = useQuery({
    queryKey: ['orderstates'],
    queryFn: getOrderStates,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })

  const { mutate: updateOrderMutate, isPending } = useUpdateOrder();
  const updateStatus = useUpdateOrderStatus();

  const inWork = orderStates?.find(state => state.name === 'В работе');
  const declined = orderStates?.find(state => state.name === 'Отклонена');
  const onWait = orderStates?.find(state => state.name === 'В ожидании');

  // Функция для получения данных с учетом всех фильтров
  const filteredData = useMemo(() => {
    let result = orders;

    if (urlStatus === 'new') {
      result = result.filter((item: Order) => item.orderStateName === 'Новая');
    }
    else if (urlStatus === 'nAgreed') {
      result = result.filter((item: Order) => item.orderStateName === 'Не согласовано' || item.orderStateName === 'Закрыта');
    }
    else if (urlStatus === 'nConfirmed') {
      result = result.filter((item: Order) => item.orderStateName === 'Возобновлена' || item.orderStateName === 'Закрыта');
    }
    else if (urlStatus === 'onControl') {
      result = result.filter((item: Order) => item.dateTechReturn !== null || item.orderStateName === 'Закрыта');
    }
    else if (urlStatus === 'mine') {
      result = result.filter((item: Order) => item.dispatcherFio === currUser);
    }
    if (hideClosed) {
      result = result.filter((item: Order) => item.orderStateName !== 'Закрыта');
    }

    return result;
  }, [urlStatus, hideClosed, orders]);

  useEffect(() => {
      setColumnFilters([]);
  }, [urlStatus]);

  const handleFiltersChange = (updater: MRT_ColumnFiltersState | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)) => {
    if (urlStatus === 'new') {
      return;
    }
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(next);
  };

  useEffect(() => {
    setColumnFilters((prev) => {
      const withoutStatus = prev.filter(f => f.id !== 'state');

      if (!urlStatus || urlStatus === 'new') {
        return withoutStatus;
      }

      return [
        ...withoutStatus,
        { id: 'state', value: urlStatus }
      ];
    });
  }, [urlStatus]);

  useEffect(() => {
    setHideClosed(true);
    //table.setRowSelection({});
  }, [location.pathname, location.search]);

  const tableKey = urlStatus ? `locked-${urlStatus}` : `hideClosed-${hideClosed}`;

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        id: 'nomer',
        header: '№ заявки',
        accessorFn: (row) => row.nomer,
        maxSize: 80,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        enableResizing: false
      },
      {
        id: 'dateCreated',
        header: 'Дата регистрации',
        accessorFn: (row) => row.dateCreated,
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ cell }) => {
          const value = cell.getValue<Dayjs | null | undefined | string>();

          if (!value) return '—';

          if (dayjs.isDayjs(value)) {
            return value.format('DD.MM.YYYY HH:mm');
          }

          return dayjs(value).format('DD.MM.YYYY HH:mm');
        },
      },
      {
        id: 'desiredDate',
        header: urlStatus === 'onControl' ? 'Дата возврата' : 'Желаемый срок',
        accessorFn: (row) =>
          urlStatus === 'onControl'
            ? row.dateTechReturn
            : row.dateFinishPlan,
        type: 'Date',
        maxSize: 120,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ cell }) => {
          const value = cell.getValue<Dayjs | null | undefined | string>();

          if (!value) return '—';

          if (dayjs.isDayjs(value)) {
            return value.format('DD.MM.YYYY HH:mm');
          }

          return dayjs(value).format('DD.MM.YYYY HH:mm');
        },
      },
      {
        id: 'dateFinishFact',
        header: 'Дата решения',
        accessorFn: (row) => row.dateFinishFact,
        type: 'string',
        maxSize: 100,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ cell }) => {
          const value = cell.getValue<Dayjs | null | undefined | string>();

          if (!value) return '—';

          if (dayjs.isDayjs(value)) {
            return value.format('DD.MM.YYYY HH:mm');
          }

          return dayjs(value).format('DD.MM.YYYY HH:mm');
        },
      },
      {
        id: 'orderState',
        header: 'Статус',
        accessorFn: (row) => row.orderStateName,
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        enableColumnFilter: urlStatus !== 'new',
        mantineFilterTextInputProps: {
          disabled: urlStatus === 'new',
          readOnly: urlStatus === 'new',
          placeholder: 'Фильтр',
        },
        mantineFilterSelectProps: {
          disabled: urlStatus === 'new',
          readOnly: urlStatus === 'new',
        },
        Cell: ({ row }) => row.original.orderStateName || 'Статуса нет'
      },
      {
        id: 'name',
        header: 'Заголовок',
        accessorFn: (row) => row.name,
        type: 'string',
        maxSize: 190,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
      },
      {
        id: 'orderType',
        header: 'Тип',
        accessorFn: (row) => row.orderTypeName,
        type: 'string',
        maxSize: 50,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        mantineTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => row.original.orderTypeName || ''
      },
      {
        id: 'initiator',
        header: 'Инициатор',
        accessorFn: (row) => row.initiatorId,
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => {
          const user = users?.find((item: User) => item.idItUser === row.original.initiatorId) || '';
          return formatFIO(user.fio1c);
        }
      },
      {
        id: 'executor',
        header: 'Пользователь',
        accessorFn: (row) => row.executorId,
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => {
          const user = users?.find((item: User) => item.idItUser === row.original.executorId) || '';
          return formatFIO(user.fio1c);
        }
      },
      {
        id: 'service',
        header: 'IT-сервис (модуль)',
        accessorFn: (row) => row.serviceFullname,
        type: 'string',
        maxSize: 160,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.serviceFullname || ''
      },
      {
        id: 'catitem',
        header: 'Услуга',
        accessorFn: (row) => row.catalogItemName,
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.catalogItemName || ''
      },
    ],
    [urlStatus],
  );

  const colorRow = (row: MRT_Row<Order>) => {
    if (row.getIsSelected()) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    const requestType = row.original.orderTypeName;

    switch (requestType) {
      case 'ЗНО':
        return 'rgba(76, 175, 80, 0.1)';
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

  const onRequestTypeSelect = (selected: string) => {
    if (selected === "Заявка на обслуживание") {
      createZNODialog();
    }
    else if (selected === "Заявка на доступ") {
      createZNDDialog();
    }
    else if (selected === "Заявка на изменение") {
      createZNIDialog();
    }
    else if (selected === "Заявка на технику") {
      createZNTDialog();
    }
    else {
      setIsCreateDialogOpen(true);
    }
  }

  function createZNDDialog() {
    setIsCreateDialogZNDOpen(true);
  }
  function createZNODialog() {
    setIsCreateDialogZNOOpen(true);
  }
  function createZNIDialog() {
    setIsCreateDialogZNIOpen(true);
  }
  function createZNTDialog() {
    setIsCreateDialogZNTOpen(true);
  }
  const onCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setIsCreateDialogZNOOpen(false);
    setIsCreateDialogZNDOpen(false);
    setIsCreateDialogZNIOpen(false);
    setIsCreateDialogZNTOpen(false);
  }

  // Парсер даты
  function parseDate(dateString: string): Date | null {
    const parts = dateString.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);

    if (year < 100) {
      year += 2000; // 24 → 2024
    }

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    return new Date(year, month, day);
  }

  const isRequestOverdue = (request: Order): boolean => {
    if (!request.dateFinishPlan) return false;

    const completedStatuses = ['Закрыта', 'Отклонена'];
    if (request.orderStateId) {
      return false;
    }
    const temp = dayjs(request.dateFinishPlan).toString();
    const desiredDate = parseDate(temp.split(' ')[0]);

    if (!desiredDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return desiredDate < today;
  };

  const handleRowClick = (row: MRT_Row<Request>) => {
    row.getToggleSelectedHandler();
  };

  const handleRowDoubleClick = (row: MRT_Row<Order>) => {
    setSelectedRequest(row.original);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const [selectedRequest, setSelectedRequest] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType] = useState(0);

  const table = useMantineReactTable({
    columns: columns,
    data: filteredData,
    enableBottomToolbar: false,
    enableColumnActions: false,
    enableColumnResizing: false,
    enableExpanding: false,
    enableHiding: false,
    enableMultiRowSelection: false,
    enablePagination: false,
    enableRowSelection: true,
    enableRowNumbers: false,
    enableRowVirtualization: true,
    enableSorting: true,
    enableSelectAll: false,
    enableTopToolbar: false,
    layoutMode: 'grid',
    columnResizeMode: 'onChange',
    filterFromLeafRows: true,
    localization: MRT_Localization_RU,
    initialState: {
      density: 'xs',
      columnVisibility: { 'mrt-row-select': false },
      showColumnFilters: true,
      sorting: [{ id: 'nomer', desc: true }],
    },
    mantineTableProps: {
      fontSize: '11px',
    },
    mantineTableContainerProps: {
      sx: {
        minHeight: 150,
        maxHeight: 850,
      }
    },
    mantineTableHeadCellProps: {
      style: {
        fontSize: '13px',
        fontWeight: 600,
        padding: '10px 4px',
      },
    },
    mantineFilterTextInputProps: {
      size: 'xs',
    },
    mantineTableBodyCellProps: ({ row, cell }) => ({
      onClick: (event) => {
        // Если это не ячейка "nomer", то выделяем строку
        if (cell.column.id === 'nomer') {
          event.stopPropagation();
          handleRowDoubleClick(row);
        }
        else {
          row.getToggleSelectedHandler()(event);
        }
      },
      sx: {
        backgroundColor: colorRow(row),
        borderLeft: '1px solid #dde7ee !important',
        color: isRequestOverdue(row.original) ? '#d32f2f' : 'inherit',
        cursor: 'pointer',
        fontWeight: row.original.orderStateName === 'Новая' ? 'bold' : 'normal',
      }
    }),
    onColumnFiltersChange: handleFiltersChange,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const selectedRowsCount = table.getSelectedRowModel().rows.length;
  const hasSelectedRows = !(selectedRowsCount > 0);

  // Хуки для управления диалогами
  const { dialogs, openDialog, closeDialog } = useDialogs();

  // Обработчики нажатия кнопок
  const handleAcceptClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    const order = selectedRows[0].original;
    if (order.idOrder == null || inWork?.idOrderState == null) return;

    updateStatus.mutate({ id: order.idOrder, statusId: inWork.idOrderState });
  };

  const handleDeclineClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    const order = selectedRows[0].original;
    if (order.idOrder == null || declined?.idOrderState == null) return;

    updateStatus.mutate({ id: order.idOrder, statusId: declined.idOrderState });

  };

  const handlePostponeClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      openDialog('postpone', selectedRows[0].original);
    }
  };

  // Обработчик подтверждения откладывания
  const handlePostponeConfirm = (comment: string) => {
    const order = dialogs.postpone.order;
    if (order?.idOrder == null || onWait?.idOrderState == null) return;

    updateOrderMutate(
      {
        id: order.idOrder,
        data: {
          idOrderState: onWait.idOrderState,
          comment: comment
        } as any,
      },
    );
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredData.map((order: Order) => ({
        '№ заявки': order.nomer || '',
        'Дата регистрации': order.dateCreated ? dayjs(order.dateCreated || '').format('DD.MM.YYYY HH:mm') : '',
        'Желаемый срок': order.dateFinishPlan ? dayjs(order.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '',
        'Дата решения': order.dateFinishFact ? dayjs(order.dateFinishFact).format('DD.MM.YYYY HH:mm') : '',
        'Статус': order.orderStateName || '',
        'Заголовок': order.name || '',
        'Тип запроса': order.orderTypeName || '',
        'Инициатор': order.initiatorId || '',
        'Пользователь': order.dispatcherFio || '',
        'IT-сервис/модуль': order.serviceFullname || '',
        'Услуга': order.catalogItemName || '',
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Заявки');

      const filename = `zayavki_${new Date().toLocaleDateString()}.xlsx`;

      XLSX.writeFile(wb, filename);

      showNotification({ title: `Файл ${filename} сохранен`, message: '', color: 'green' });
    }
    catch (error) {
      showNotification({ title: 'Ошибка', message: 'Не удалось сохранить файл', color: 'red' });
    }
  };

  /*/ Обработчик нажатия кнопки На контроль
  const handleControlClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      openDialog('control', selectedRows[0].original);
    }
  };

  // Обработчик подтверждения постановки на контроль
  const handleControlConfirm = (equipment: string, returnDate: Date | null) => {
    const request = dialogs.control.request;
    if (request && returnDate) {
      console.log('Ставим на контроль:', {
        request: request.nomer,
        newStatus: 'На контроле',
        equipment: equipment,
        returnDate: returnDate.toISOString()
      });
      //
      // Реальная реализация
      //
      closeDialog('control');
    }
  };*/

  return (
    <div>
      <Box height={50}>
        <RequestCreateZNODialog
          isOpen={isCreateDialogZNOOpen}
          onClose={onCreateDialogClose}
        />
        <RequestCreateZNDDialog
          isOpen={isCreateDialogZNDOpen}
          onClose={onCreateDialogClose}
        />
        <RequestCreateZNIDialog
          isOpen={isCreateDialogZNIOpen}
          onClose={onCreateDialogClose}
        />
        <RequestCreateZNTDialog
          isOpen={isCreateDialogZNTOpen}
          onClose={onCreateDialogClose}
        />
        <PostponeDialog
          open={dialogs.postpone.open}
          onClose={() => closeDialog('postpone')}
          onConfirm={handlePostponeConfirm}
          request={dialogs.postpone.order}
        />
        {/* Диалог на контроль 
        <ControlDialog
          open={dialogs.control.open}
          onClose={() => closeDialog('control')}
          onConfirm={handleControlConfirm}
          request={dialogs.control.request}
        />*/}
        <Grid2 container spacing={1} direction={'row'} alignItems="left" justifyContent="left" paddingBottom='15px'>
          <Grid2 size="auto">
            <SplitButton
              buttonText={'Создать заявку'}
              menuItems={['Заявка на обслуживание', 'Заявка на доступ', 'Заявка на изменение', 'Заявка на технику']}
              startIcon={<Add />}
              size={'small'}
              onSelect={onRequestTypeSelect}
            />
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Build />}
              size={'small'}
              disabled={hasSelectedRows}
              onClick={handleAcceptClick}
            >
              Принять в работу
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="error"
              startIcon={<Clear />}
              size={'small'}
              disabled={hasSelectedRows}
              onClick={handleDeclineClick}
            >
              Отклонить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="warning"
              startIcon={<Note />}
              size={'small'}
              disabled={hasSelectedRows}
              onClick={handlePostponeClick}
            >
              Отложить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="success"
              startIcon={<Check />}
              size={'small'}
              disabled={hasSelectedRows}
            >
              Закрыть заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              size={'small'}
              disabled={hasSelectedRows}
            >
              Подтвердить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Save />}
              size={'small'}
              fullWidth={true}
              onClick={exportToExcel}
            >
              В Excel
            </Button>
          </Grid2>
          <Grid2 size="auto" alignContent="center">
            <MantineProvider theme={{ cursorType: 'pointer' }}>
              <Checkbox
                disabled={urlStatus === "new" ? true : false}
                checked={hideClosed}
                onChange={(event) => setHideClosed(event.currentTarget.checked)}
                label="Скрыть закрытые заявки"
                size="md"
              />
            </MantineProvider>
          </Grid2>
        </Grid2>
        <MantineReactTable key={tableKey} table={table} />
      </Box>
      <SupportGeneralDialog
        isOpen={isDialogOpen}
        request={selectedRequest}
        disabled={false}
        onClose={handleDialogClose}
      />
    </div>
  );
}