import { useMemo, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { Grid2, Box, Button } from '@mui/material';
import { Add, Check, Clear, ThreeSixty, Mode } from '@mui/icons-material';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import {
  SupportGeneralDialog,
  formatFIO, RequestCreateZNODialog,
  RequestCreateZNDDialog, RequestCreateZNIDialog,
  RequestCreateZNTDialog
} from '../../components';
import SplitButton from '../../components/split-button/split-button.component';
import dayjs, { Dayjs } from 'dayjs';

import { components } from '../../types/api';
import { useOrdersByInitiator } from '../../hooks/useOrder';

type Order = components['schemas']['OrderResponseDTO'];

export function RequestsAllPage() {
  const [requestTypeDialog, setRequestType] = useState('');
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogZNIOpen, setIsCreateDialogZNIOpen] = useState(false);
  const [isCreateDialogZNTOpen, setIsCreateDialogZNTOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);

  // TODO: Заменить на настоящего пользователя
  //const currInitiator = "Арбузов Александр Александрович";
  const currInitiatorId = 1;

  const { data: currInitiatorOrders = [] } = useOrdersByInitiator(currInitiatorId);

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
        Cell: ({ row }) => row.original.orderStateName || 'Статуса нет'
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
          const fullName = row.original.initiatorFio || '';
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
          const fullName = row.original.dispatcherFio || '';
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
        Cell: ({ row }) => row.original.serviceFullname || ''
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
        Cell: ({ row }) => row.original.catalogItemName || ''
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
    if (request.orderStateId) {
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

  const handleEditClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    setSelectedRequest(selectedRows[0].original);
    setIsDialogOpen(true);
  }

  const handleNomerClick = (row: MRT_Row<Order>) => {
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
    data: currInitiatorOrders,
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
          handleNomerClick(row);
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
  });

  // Доступность кнопок по нажатию на строку таблицы
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
        <Grid2 container spacing={2} direction={'row'} alignItems="left" justifyContent="left" paddingBottom='15px'>
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
              startIcon={<Mode />}
              size={'small'}
              disabled={hasSelectedRows}
              onClick={handleEditClick}
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
        disabled={false}
        onClose={handleDialogClose}
      />
    </div>
  );
}