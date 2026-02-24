import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { Order } from '../../api/models';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save, ArrowBack, RoundaboutLeft, RoundedCorner, RouteRounded, ThreeSixty, ThreeSixtyRounded } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { SupportGeneralDialog } from '../../components';
import SplitButton from '../../components/split-button/split-button.component';
import { RequestCreateDialog } from '../../components';
import { RequestCreateZNODialog } from '../../components/request-create-zno-dialog/request-create-zno-dialog';
import { RequestCreateZNDDialog } from '../../components/request-create-znd-dialog/request-create-znd-dialog';
import { RequestCreateZNIDialog } from '../../components/request-create-zni-dialog/request-create-zni-dialog';
import { IconPencil } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getOrderTypes } from '../../api/services/orderTypeService';

import { getOrders } from '../../api/services/orderService';

export function RequestsAllPage() {
  const [requestTypeDialog, setRequestType] = useState(0);
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogZNIOpen, setIsCreateDialogZNIOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);
  const currInitiator = "Борисов Борис Борисович";

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const {
    data: orderTypes = [],
    isLoading: orderLoad,
    error: orderError,
  } = useQuery({
    queryKey: ['ordertypes'],
    queryFn: getOrderTypes,
    staleTime: Infinity
  });

  const filteredData = useMemo(() => {
    let result = orders;
    //Высвечиваем только данные, настоящего пользователя
    result = result.filter((item: any) => item.initiator === currInitiator);

    if (hideClosed) {
      result = result.filter((item: any) => item.orderState !== 4);
    }

    return result;
  }, [hideClosed, orders]);

  useEffect(() => {
    setHideClosed(true);
  }, [location.pathname, location.search]);

  const formatFIO = (fullName: string): string => {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return fullName;

    const lastName = parts[0];
    const firstName = parts[1]?.charAt(0).toUpperCase() || '';
    const middleName = parts[2]?.charAt(0).toUpperCase() || '';

    return `${lastName} ${firstName}.${middleName ? middleName + '.' : ''}`;
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        header: '№ заявки',
        accessorKey: 'nomer',
        maxSize: 80,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        enableResizing: false,
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
        type: 'string',
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
        accessorKey: 'orderState',
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.orderState?.name || 'Статуса нет'
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
        Cell: ({ row }) => row.original.orderType?.name || ''
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
          const fullName = row.original.initiator?.fio1c || '';
          return formatFIO(fullName);
        }
      },
      {
        header: 'Пользователь',
        accessorKey: 'dispatcher',
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => {
          const fullName = row.original.dispatcher?.fio1c || '';
          return formatFIO(fullName);
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
        Cell: ({ row }) => row.original.service?.fullname || ''
      },
      {
        header: 'Услуга',
        accessorKey: 'catalogItem',
        type: 'string',
        maxSize: 140,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.catalogItem?.name || ''
      },
    ],
    [],
  );

  // Цвет заливки строки
  const colorRow = (row: MRT_Row<Order>) => {
    if (row.getIsSelected()) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    // Получаем тип заявки из данных строки
    const requestType = row.original.orderType?.name;


    // Цвета для разных типов заявок
    switch (requestType) {
      case 'ЗНО':
        return 'rgba(76, 175, 80, 0.1)';
      case 'ЗНД':
        return 'rgba(255, 152, 0, 0.1)';
      case 'ЗНИ':
        return 'rgba(244, 67, 54, 0.1)';
      default:
        return 'hsla(0, 88%, 72%, 1.00)';
    }
  };

  const onRequestTypeSelect = (selected: any) => {
    setRequestType(selected);
    if (selected === "Заявка на обслуживание") {
      createZNODialog();
    }
    else if (selected === "Заявка на доступ") {
      createZNDDialog();
    }
    else if (selected === "Заявка на изменение") {
      createZNIDialog();
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
  const onCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setIsCreateDialogZNOOpen(false);
    setIsCreateDialogZNDOpen(false);
    setIsCreateDialogZNIOpen(false);
  }
  useEffect(() => {
    console.debug('111' + requestTypeDialog);
  }, [requestTypeDialog]
  );

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
  const isRequestOverdue = (request: Order): boolean => {
    if (!request.dateFinishPlan) return false;

    // Если заявка уже завершена не считаем просроченной
    const completedStatuses = ['Закрыта', 'Отклонена'];
    if (request.orderState) {
      return false;
    }
    const temp = dayjs(request.dateFinishPlan).toString();
    const desiredDate = parseDate(temp.split(' ')[0]);

    // Если дата не распарсилась не считаем просроченной
    if (!desiredDate) return false;

    // Сравниваем с текущей датой (без времени)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return desiredDate < today;
  };

  // Обработчик двойного клика
  const handleRowDoubleClick = (row: MRT_Row<Order>) => {
    setSelectedRequest(row.original);
    setIsDialogOpen(true);
  };

  // Обработчик закрытия диалога
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };




  const [selectedRequest, setSelectedRequest] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType] = useState(0);

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  // Создание таблицы
  const table = useMantineReactTable({
    columns: columns,
    data: orders,
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
        maxHeight: 850
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
        // Если это не ячейка "header", то выделяем строку
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
        fontWeight: row.original.orderState?.name === 'Новая' ? 'bold' : 'normal',
      }
    }),
  });

  // Доступность кнопок по нажатию на строку таблицы
  const selectedRowsCount = table.getSelectedRowModel().rows.length;
  const hasSelectedRows = !(selectedRowsCount > 0);

  return (
    <div>
      <Box height={50}>
        <RequestCreateDialog
          isOpen={isCreateDialogOpen}
          requestName={requestType.toString()}
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
        <RequestCreateZNIDialog
          isOpen={isCreateDialogZNIOpen}
          onClose={onCreateDialogClose}
        />
        <Grid2 container spacing={2} direction={'row'} alignItems="left" justifyContent="left" paddingBottom='15px'>
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
              color="error"
              startIcon={<Clear />}
              size={'small'}
              disabled={hasSelectedRows}
            >
              Отменить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="warning"
              startIcon={<IconPencil />}
              size={'small'}
              disabled={hasSelectedRows}
            >
              Редактировать заявку
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
              Подтвердить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<ThreeSixty />}
              size={'small'}
              disabled={hasSelectedRows}
            >
              Возобновить заявку
            </Button>
          </Grid2>
          <Grid2 size="auto" alignContent="center">
            <MantineProvider theme={{ cursorType: 'pointer' }}>
              <Checkbox
                checked={hideClosed}
                onChange={(event) => setHideClosed(event.currentTarget.checked)}
                label="Скрыть закрытые заявки"
                size="md"
              />
            </MantineProvider>
          </Grid2>
        </Grid2>

        <MantineReactTable table={table} />

      </Box>

      <SupportGeneralDialog
        isOpen={isDialogOpen}
        request={selectedRequest}
        onClose={handleDialogClose}
      />
    </div>
  );
}