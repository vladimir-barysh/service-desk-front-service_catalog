import { useMemo, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable, type MRT_ColumnFiltersState } from 'mantine-react-table';
import { useSearchParams } from 'react-router-dom';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import {
  formatFIO, SupportGeneralDialog, RequestCreateZNODialog,
  RequestCreateZNDDialog, RequestCreateZNTDialog,
  RequestCreateZNIDialog,
  PostponeTaskDialog
} from '../../components';
import SplitButton from '../../components/split-button/split-button.component';
import { showNotification } from '../../context';
import * as XLSX from 'xlsx';
import dayjs, { Dayjs } from 'dayjs';

import { components } from '../../types/api';
import { useTasks, useUpdateTask } from '../../hooks/useTask';
import { useUsers } from '../../hooks/useUser';
import { useOrders } from '../../hooks/useOrder';
import { useStates } from '../../hooks/useState';

type Order = components['schemas']['OrderResponseDTO'];
type OrderTask = components['schemas']['TaskResponseDTO'];
type User = components['schemas']['UserResponseDTO'];


export function TasksMyAllPage() {
  const currExecutorId = 1;
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogZNIOpen, setIsCreateDialogZNIOpen] = useState(false);
  const [isCreateDialogZNTOpen, setIsCreateDialogZNTOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);
  const [hideAll, setHideAll] = useState(true);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // фильтр по статусу
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const { mutate: updateTaskMutate } = useUpdateTask();

  const { data: tasks = [] } = useTasks();
  const { data: users = [] } = useUsers();
  const { data: orders = [] } = useOrders();
  const { data: states = [] } = useStates();

  const filteredData = useMemo(() => {
    let result = tasks;

    // Фильтр по статусу из URL
    if (urlStatus === 'onAgree') {
      result = result.filter((item: OrderTask) => (item.taskStateName === 'На согласовании' || item.taskStateName === 'Закрыта'));
    }
    else if (urlStatus) {
      result = result.filter((item: OrderTask) => item.taskStateName === urlStatus);
    }

    if (hideClosed) {
      result = result.filter((item: OrderTask) => item.taskStateName !== 'Закрыта');
    }

    if (hideAll) {
      result = result.filter((item: OrderTask) => item.executorId === currExecutorId || item.taskStateName === 'Закрыта');
    }

    return result;
  }, [urlStatus, hideClosed, hideAll, currExecutorId, tasks]);

  const handleFiltersChange = (updater: MRT_ColumnFiltersState | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(next);
  };

  // Эффект для синхронизации URL параметров с состоянием фильтров
  useEffect(() => {
    if (urlStatus === 'onAgree' || urlStatus === 'onExecution') {
      setColumnFilters([]);
    } else if (urlStatus) {
      setColumnFilters([{ id: 'status', value: urlStatus }]);
    } else {
      setColumnFilters([]);
    }
  }, [urlStatus]);

  useEffect(() => {
    setHideClosed(true);
    table.setRowSelection({});
  }, [location.pathname, location.search]);

  const tableKey = urlStatus ? `locked-${urlStatus}` : `hideClosed-${hideClosed}`;

  const columns = useMemo<MRT_ColumnDef<OrderTask>[]>(
    () => [
      {
        header: '№ заявки',
        accessorKey: 'orderNomer',
        maxSize: 80,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        enableResizing: false,
        Cell: ({ row }) => row.original.orderNomer,
      },
      {
        header: 'Дата регистрации',
        accessorKey: 'dateCreated',
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
        header: 'Желаемый срок',
        accessorKey: 'dateFinishPlan',
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
        header: 'Дата решения',
        accessorKey: 'dateFinishFact',
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
        header: 'Статус',
        accessorKey: 'taskState',
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.taskStateName || 'Статуса нет'
      },
      {
        header: 'Заголовок',
        accessorKey: 'name',
        type: 'string',
        maxSize: 190,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.orderName,
      },
      {
        header: 'Тип',
        accessorKey: 'orderType',
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
        header: 'Инициатор',
        accessorKey: 'initiator',
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => {
          const fullName = row.original.creatorFio || '';
          return formatFIO(fullName);
        }
      },
      {
        id: 'dispatcher',
        header: 'Исполнитель',
        accessorFn: (row) => row.executorId,
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => {
          const user = users?.find((item: User) => item.idItUser === row.original.executorId);
          return formatFIO(user?.fio1c || '');
        }
      },
      {
        header: 'IT-сервис (модуль)',
        accessorKey: 'service',
        type: 'string',
        maxSize: 160,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.orderServiceFullname || ''
      },
      {
        header: 'Услуга',
        accessorKey: 'catitem',
        type: 'string',
        maxSize: 160,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.orderCatItemName || ''
      },
    ],
    [urlStatus, users],
  );

  // Цвет заливки строки
  const colorRow = (row: MRT_Row<OrderTask>) => {
    if (row.getIsSelected()) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    // Получаем тип заявки из данных строки
    const requestType = row.original.orderTypeName;

    // Цвета для разных типов заявок
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

  // Функция для проверки просрочки заявки
  const isTaskOverdue = (task: OrderTask): boolean => {
    if (!task.dateFinishPlan) return false;

    // Если заявка уже завершена не считаем просроченной
    //const completedStatuses = ['Закрыта', 'Отклонена'];

    if (task.taskStateName) {
      return false;
    }
    const temp = dayjs(task.dateFinishPlan).toString();
    const desiredDate = parseDate(temp.split(' ')[0]);

    // Если дата не распарсилась не считаем просроченной
    if (!desiredDate) return false;

    // Сравниваем с текущей датой (без времени)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return desiredDate < today;
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredData.map((task: OrderTask) => ({
        '№ заявки': task.orderNomer || '',
        'Дата регистрации': task.dateCreated ? dayjs(task.dateCreated || '').format('DD.MM.YYYY HH:mm') : '',
        'Желаемый срок': task.dateFinishPlan ? dayjs(task.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '',
        'Дата решения': task.dateFinishFact ? dayjs(task.dateFinishFact).format('DD.MM.YYYY HH:mm') : '',
        'Статус': task.taskStateName || '',
        'Заголовок': task.orderName || '',
        'Тип запроса': task.orderTypeName || '',
        'Инициатор': task.creatorFio || '',
        'Пользователь': task.executorFio || '',
        'IT-сервис/модуль': task.orderServiceFullname || '',
        'Услуга': task.orderCatItemName || '',
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

  const isNewTask = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    const task = selectedRows[0].original;
    return task.taskStateName === 'Новая' ? true : false;
  }

  const inWork = states?.find(state => state.name === 'В работе');
  const declined = states?.find(state => state.name === 'Отклонена');
  const onWait = states?.find(state => state.name === 'В ожидании');

  const handleAcceptClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    const task = selectedRows[0].original;
    if (task.idOrderTask == null || inWork?.idOrderState == null) return;

    updateTaskMutate({ id: task.idOrderTask, data: { idTaskState: inWork.idOrderState } });
  };

  // Обработчик двойного клика
  const handleNomerClick = (row: MRT_Row<OrderTask>) => {
    setSelectedOrder(orders?.find((item: Order) => item.idOrder === row.original.orderId) || null);
    setIsDialogOpen(true);
  };

  // Обработчик закрытия диалога
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  // Создание таблицы
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
      sorting: [{ id: 'orderNomer', desc: true }],
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
        if (cell.column.id === 'orderNomer') {
          event.stopPropagation();
          handleNomerClick(row);
        }
        else {
          row.getToggleSelectedHandler()(event);
        }
      },
      sx: {
        backgroundColor: colorRow(row),
        borderLeft: '1px solid #dde7ee !important',
        color: isTaskOverdue(row.original) ? '#d32f2f' : 'inherit',
        cursor: 'pointer',
        fontWeight: row.original.taskStateName === 'Новая' ? 'bold' : 'normal',
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
              onClick={handleAcceptClick}
              disabled={hasSelectedRows || !isNewTask()}
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
            >
              Отклонить задачу
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="warning"
              startIcon={<Note />}
              size={'small'}
              disabled={hasSelectedRows}
            >
              Отложить задачу
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
              Закрыть задачу
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              size={'small'}
              disabled={hasSelectedRows}
            >
              На контроль
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
                checked={hideAll}
                onChange={(event) => setHideAll(event.currentTarget.checked)}
                label="Только мои задачи"
                size="md"
              />
            </MantineProvider>
          </Grid2>
          <Grid2 size="auto" alignContent="center">
            <MantineProvider theme={{ cursorType: 'pointer' }}>
              <Checkbox
                checked={hideClosed}
                onChange={(event) => setHideClosed(event.currentTarget.checked)}
                label="Скрыть закрытые задачи"
                size="md"
              />
            </MantineProvider>
          </Grid2>
        </Grid2>

        <MantineReactTable key={tableKey} table={table} />

      </Box>

      <SupportGeneralDialog
        isOpen={isDialogOpen}
        request={selectedOrder}
        disabled={true}
        onClose={handleDialogClose}
      />

    </div>
  );
}