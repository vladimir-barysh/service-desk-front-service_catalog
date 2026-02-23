import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable, type MRT_ColumnFiltersState } from 'mantine-react-table';
import { useSearchParams } from 'react-router-dom';
import { type Order } from '../../api/models';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { SupportGeneralDialog, RequestCreateDialog, } from '../../components';
import { ControlDialog, PostponeDialog } from '../../components/support-button-dialogs';
import SplitButton from '../../components/split-button/split-button.component';
import { RequestCreateZNODialog } from '../../components/request-create-zno-dialog/request-create-zno-dialog';
import { RequestCreateZNDDialog } from '../../components/request-create-znd-dialog/request-create-znd-dialog';
import { RequestCreateZNIDialog } from '../../components/request-create-zni-dialog/request-create-zni-dialog';
import { useDialogs } from '../../components/support-hooks/use-dialog-state';
import dayjs, { Dayjs } from 'dayjs';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../api/services/orderService';
import { url } from 'inspector';

import * as XLSX from 'xlsx';

import { notifications } from '@mantine/notifications';

export function SupportAllPage() {
  const [requestTypeDialog, setRequestType] = useState(0);
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogZNIOpen, setIsCreateDialogZNIOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);

  const currUser = "Воронин Владимир Владимирович";
  const currUser1 = "Борисов Борис Борисович";

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const clearAllFilters = () => {
    setColumnFilters([]);
  };

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const filteredData = useMemo(() => {
    let result = orders;

    if (urlStatus === 'Новая') {
      result = result.filter((item: any) => item.orderState?.name === urlStatus);
    }
    else if (urlStatus === 'nAgreed') {
      result = result.filter((item: any) => item.orderState?.name === 'Не согласовано' || item.orderState?.name === 'Закрыта');
    }
    else if (urlStatus === 'nConfirmed') {
      result = result.filter((item: any) => item.orderState?.name === 'Возобновлена' || item.orderState?.name === 'Закрыта');
    }
    else if (urlStatus === 'onControl') {
      result = result.filter((item: any) => item.orderState?.name === 'На контроле' || item.orderState?.name === 'Закрыта');
    }
    else if (urlStatus === 'mine') {
      result = result.filter((item: any) => item.dispatcher?.name === currUser);
    }
    else {
      clearAllFilters();
    }
    if (hideClosed) {
      result = result.filter((item: any) => item.orderState?.name !== 'Закрыта');
    }

    return result;
  }, [urlStatus, hideClosed]);



  const handleFiltersChange = (updater: MRT_ColumnFiltersState | ((old: MRT_ColumnFiltersState) => MRT_ColumnFiltersState)) => {
    if (urlStatus) {
      return;
    }
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(next);
  };

  useEffect(() => {
    setColumnFilters((prev) => {
      let newFilters = prev.filter(f => f.id !== 'status');

      if (urlStatus === 'nAgreed' || urlStatus === 'nConfirmed' || urlStatus === 'onControl' || urlStatus === 'mine') {
        return newFilters;
      }
      else if (urlStatus) {
        newFilters = [...newFilters, { id: 'status', value: urlStatus }];
      }

      return newFilters;
    });
  }, [urlStatus, hideClosed]);

  useEffect(() => {
    setHideClosed(true);
    table.setRowSelection({});
  }, [location.pathname, location.search]);

  const tableKey = urlStatus ? `locked-${urlStatus}` : `hideClosed-${hideClosed}`;

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
        enableResizing: false
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
        header: 'Статус',
        accessorKey: 'orderState',
        type: 'string',
        maxSize: 130,
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
        Cell: ({ row }) => row.original.orderState?.name || 'Статуса нет'
      },
      {
        header: 'Заголовок',
        accessorKey: 'name',
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
      },
      {
        header: 'Тип запроса',
        accessorKey: 'orderType',
        type: 'string',
        maxSize: 90,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.orderType?.name || ''
      },
      {
        header: 'Инициатор',
        accessorKey: 'initiator',
        type: 'string',
        maxSize: 150,
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
        maxSize: 150,
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
        maxSize: 150,
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
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр',
        },
        Cell: ({ row }) => row.original.catalogItem?.name || ''
      },
    ],
    [urlStatus],
  );

  const colorRow = (row: MRT_Row<Order>) => {
    if (row.getIsSelected()) {
      return 'rgba(23, 139, 241, 0.2)';
    }

    const requestType = row.original.orderType?.name;

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
    if (request.orderState) {
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
    enableExpanding: false,
    enableTopToolbar: false,
    enableRowSelection: true,
    enableRowNumbers: false,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    enableSorting: true,
    enableHiding: false,
    enableColumnResizing: false,
    layoutMode: 'grid',
    columnResizeMode: 'onChange',
    filterFromLeafRows: true,
    enableColumnActions: false,
    localization: MRT_Localization_RU,
    initialState: {
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 100 },
      columnVisibility: { 'mrt-row-select': false },
      showColumnFilters: true,
      sorting: [{ id: 'nomer', desc: true }],
    },

    state: { columnFilters },
    onColumnFiltersChange: handleFiltersChange,

    mantineTableProps: {
      fontSize: '11px',
    },

    mantineTableContainerProps: { sx: { minHeight: 150, maxHeight: 800 } },

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
        cursor: 'pointer',
        border: '1px solid #dde7ee',
        fontWeight: row.original.orderState?.name === 'Новая' ? 'bold' : 'normal',
        color: isRequestOverdue(row.original) ? '#d32f2f' : 'inherit',
      }
    }),
  });

  // Доступность кнопок по нажатию на строку таблицы
  const selectedRowsCount = table.getSelectedRowModel().rows.length;
  const hasSelectedRows = !(selectedRowsCount > 0);

  // Хук для управления диалогами
  const { dialogs, openDialog, closeDialog } = useDialogs();

  // Обработчик нажатия кнопки Отложить заявку
  const handlePostponeClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      openDialog('postpone', selectedRows[0].original);
    }
  };

  // Обработчик подтверждения откладывания
  const handlePostponeConfirm = (comment: string) => {
    const request = dialogs.postpone.request;
    if (request) {
      console.log('Откладываем заявку:', {
        request: request.nomer,
        newStatus: 'В ожидании',
        comment: comment
      });
      //
      // Реальная реализация
      //
      closeDialog('postpone');
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = filteredData.map((order: Order) => ({
        '№ заявки': order.nomer || '',
        'Дата регистрации':  order.dateCreated ? dayjs(order.dateCreated || '').format('DD.MM.YYYY HH:mm') : '',
        'Желаемый срок': order.dateFinishPlan ? dayjs(order.dateFinishPlan).format('DD.MM.YYYY HH:mm') : '',
        'Дата решения': order.dateFinishFact ? dayjs(order.dateFinishFact).format('DD.MM.YYYY HH:mm') : '',
        'Статус': order.orderState?.name || '',
        'Заголовок': order.name || '',
        'Тип запроса': order.orderType?.name || '',
        'Инициатор': order.initiator?.fio1c || '',
        'Пользователь': order.dispatcher || '',
        'IT-сервис/модуль': order.service?.fullname || '',
        'Услуга': order.catalogItem?.name || '',
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Заявки');

      const filename = `zayavki_${new Date().toLocaleDateString()}.xlsx`;

      XLSX.writeFile(wb, filename);

      notifications.show({
        title: 'Успешно',
        message: `Файл ${filename} сохранен`,
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
    }
    catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить файл',
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
        {/* Диалог откладывания */}
        <PostponeDialog
          open={dialogs.postpone.open}
          onClose={() => closeDialog('postpone')}
          onConfirm={handlePostponeConfirm}
          request={dialogs.postpone.request}
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
              disabled={hasSelectedRows}
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
                disabled={urlStatus === "Новая" ? true : false}
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
        onClose={handleDialogClose}
      />
    </div>
  );
}