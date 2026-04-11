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
import { formatFIO, SupportGeneralDialog, RequestCreateDialog, RequestCreateZNODialog, 
  RequestCreateZNDDialog, 
} from '../../../components';
import SplitButton from '../../../components/split-button/split-button.component';
import { showNotification } from '../../../context';
import { Order, OrderTask, getOrders, getTasks, } from '../../../api';
import * as XLSX from 'xlsx';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';



export function TasksMyAllPage() {
  const currUser = 'Воронин Владимир Владимирович';
  const [requestTypeDialog, setRequestType] = useState(0);
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);
  const [rowSelection, setRowSelection] = useState({});

  // фильтр по статусу
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const clearAllFilters = () => {
    setColumnFilters([]);
  };

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const filteredData = useMemo(() => {
    let result = tasks;

    // Фильтр по статусу из URL
    if (urlStatus === 'onAgree') {
      result = result.filter((item: OrderTask) => (item.taskState?.name === 'На согласовании' || item.taskState?.name === 'Закрыта'));
    }
    else if (urlStatus === 'onExecution') {
      result = result.filter((item: OrderTask) => item.taskState?.name !== 'Закрыта');
    }
    else if (urlStatus) {
      result = result.filter((item: OrderTask) => item.taskState?.name === urlStatus);
    }

    if (hideClosed) {
      result = result.filter((item: OrderTask) => item.taskState?.name !== 'Закрыта');
    }

    return result;
  }, [urlStatus, hideClosed, currUser, tasks]);

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
        accessorKey: 'nomer',
        maxSize: 80,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        enableResizing: false,
        Cell: ({ row }) => row.original.order?.nomer,
      },
      {
        header: 'Дата регистрации',
        accessorKey: 'dateCreated',
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
        header: 'Желаемый срок',
        accessorKey: 'dateFinishPlan',
        type: 'Date',
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
        accessorKey: 'orderState',
        type: 'string',
        maxSize: 120,
        enableResizing: false,
        enableColumnFilter: !urlStatus,
        mantineFilterTextInputProps: {
          disabled: !!urlStatus,
          readOnly: !!urlStatus,
          placeholder: urlStatus ? `Зафиксировано: ${urlStatus}` : 'Фильтр',
        },
        mantineFilterSelectProps: {
          disabled: !!urlStatus || hideClosed,
          readOnly: !!urlStatus || hideClosed,
        },
        Cell: ({ row }) => row.original.taskState?.name || 'Статуса нет'
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
        Cell: ({ row }) => row.original.order?.name,
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
        Cell: ({ row }) => row.original.order?.orderType?.name || ''
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
          const fullName = row.original.creator?.fio1c || '';
          return formatFIO(fullName);
        }
      },
      {
        header: 'IT-сервис (модуль)',
        accessorKey: 'service',
        type: 'string',
        maxSize: 200,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.order?.service?.fullname || ''
      },
      {
        header: 'Услуга',
        accessorKey: 'catitem',
        type: 'string',
        maxSize: 200,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.order?.catalogItem?.name || ''
      },
    ],
    [urlStatus],
  );

  // Цвет заливки строки
  const colorRow = (row: MRT_Row<OrderTask>) => {
    if (row.getIsSelected()) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    // Получаем тип заявки из данных строки
    const requestType = row.original.order?.orderType?.name;

    // Цвета для разных типов заявок
    switch (requestType) {
      case 'ЗНО':
        return 'rgba(76, 175, 80, 0.1)';
      case 'ЗНД':
        return 'rgba(255, 152, 0, 0.1)';
      case 'ЗНИ':
        return 'rgba(244, 67, 54, 0.1)';
      case 'инцидент':
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const onRequestTypeSelect = (selected: any) => {
    setRequestType(selected);
    if (selected === "Заявка на обслуживание" || selected === "Инцидент") {
      createZNODialog();
    }
    else if (selected === "Заявка на доступ") {
      createZNDDialog();
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
  const onCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setIsCreateDialogZNOOpen(false);
    setIsCreateDialogZNDOpen(false);
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
    const completedStatuses = ['Закрыта', 'Отклонена'];
    if (task.taskState) {
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

  // Обработчик двойного клика
  const handleRowDoubleClick = (row: MRT_Row<OrderTask>) => {
    setSelectedtask(row.original);
    setIsDialogOpen(true);
  };

  // Обработчик закрытия диалога
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedtask(null);
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredData.map((task: OrderTask) => ({
        '№ заявки': task.order?.nomer || '',
        'Дата регистрации': task.dateCreated ? dayjs(task.dateCreated || '').format('DD.MM.YYYY HH:mm') : '',
        'Желаемый срок': task.dateFinishPlan ? dayjs(task.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '',
        'Дата решения': task.dateFinishFact ? dayjs(task.dateFinishFact).format('DD.MM.YYYY HH:mm') : '',
        'Статус': task.order?.orderState?.name || '',
        'Заголовок': task.order?.name || '',
        'Тип запроса': task.order?.orderType?.name || '',
        'Инициатор': task.creator?.fio1c || '',
        'Пользователь': task.executor?.fio1c || '',
        'IT-сервис/модуль': task.order?.service?.fullname || '',
        'Услуга': task.order?.catalogItem?.name || '',
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

  const [selectedtask, setSelectedtask] = useState<OrderTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskType] = useState(0);

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
        color: isTaskOverdue(row.original) ? '#d32f2f' : 'inherit',
        cursor: 'pointer',
        fontWeight: row.original.taskState?.name === 'Новая' ? 'bold' : 'normal',
      }
    }),
    onColumnFiltersChange: handleFiltersChange,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <Box height={50}>
        <RequestCreateDialog
          isOpen={isCreateDialogOpen}
          requestName={taskType.toString()}
          onClose={onCreateDialogClose}
        />
        <RequestCreateZNODialog
          isOpen={isCreateDialogZNOOpen}
          onClose={onCreateDialogClose}
        />
        <RequestCreateZNDDialog
          isOpen={isCreateDialogZNDOpen}
          onClose={onCreateDialogClose}
        />
        <Grid2 container spacing={1} direction={'row'} alignItems="left" justifyContent="left" paddingBottom='15px'>
          <Grid2 size="auto">
            <SplitButton
              buttonText={'Создать заявку'}
              menuItems={['Заявка на обслуживание', 'Заявка на доступ', 'Заявка на изменение']}
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
            >
              Закрыть задачу
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              size={'small'}
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
        request={null}
        onClose={handleDialogClose}
      />
    </div>
  );
}