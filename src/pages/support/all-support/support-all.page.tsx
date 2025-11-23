import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef,  MRT_Row, useMantineReactTable, type MRT_ColumnFiltersState } from 'mantine-react-table';
import { useSearchParams } from 'react-router-dom';
import { data, type Request } from './makeData';
import React, { useEffect, useState, useCallback } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MantineProvider, Checkbox } from '@mantine/core';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { SupportGeneralDialog } from '../../../components';
import SplitButton from '../../../components/split-button/split-button.component';
import { RequestCreateDialog } from '../../../components';
import { RequestCreateZNODialog } from '../../../components/request-create-zno-dialog/request-create-zno-dialog';
import { RequestCreateZNDDialog } from '../../../components/request-create-znd-dialog/request-create-znd-dialog';
import { url } from 'inspector';


export function SupportAllPage() {
  const [requestTypeDialog, setRequestType] = useState(0);
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hideClosed, setHideClosed] = useState(true);

  // фильтр по статусу
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const clearAllFilters = () => {
    setColumnFilters([]);
  };

  // Функция для получения данных с учетом всех фильтров
  const filteredData = useMemo(() => {
    let result = data;
    
    // Фильтр по статусу из URL
    if (urlStatus === 'Новая') { 
      result = result.filter(item => item.status === urlStatus);
    }
    else if (urlStatus === 'nAgreed') {
      result = result.filter(item => item.status === 'Не согласовано' || item.status === 'Закрыта');
    }
    else if (urlStatus === 'nConfirmed') {
      result = result.filter(item => item.status === 'Возобновлена' || item.status === 'Закрыта');
    }
    else if (urlStatus === 'onControl') {
      result = result.filter(item => item.status === 'На контроле' || item.status === 'Закрыта');
    }
    else {
      clearAllFilters();
    }
    // Фильтр по чекбоксу "Скрыть закрытые"
    if (hideClosed) {
      result = result.filter(item => item.status !== 'Закрыта');
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

  // Эффект для синхронизации URL параметров с состоянием фильтров
  useEffect(() => {
    setColumnFilters((prev) => {
      let newFilters = prev.filter(f => f.id !== 'status');
      
      // Добавляем фильтр из URL если есть
      if (urlStatus === 'nAgreed' || urlStatus === 'nConfirmed' || urlStatus === 'onControl') {
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
  }, [location.pathname, location.search]); // Сбрасываем при изменении пути или параметров

  const tableKey = urlStatus ? `locked-${urlStatus}` : `hideClosed-${hideClosed}`;

  const columns = useMemo<MRT_ColumnDef<Request>[]>(
    () => [
      {
        header: '№ заявки',
        accessorKey: 'requestNumber',
        maxSize: 90,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по №',
        },
        enableResizing: false,
      },
      {
        header: 'Дата регистрации',
        accessorKey: 'dateRegistration',
        type: 'string',
        maxSize: 175,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по дате регистрации',
        },
      },
      {
        header: 'Желаемый срок',
        accessorKey: 'dateDesired',
        type: 'string',
        maxSize: 165,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по желаемому сроку',
        },
      },
      {
        header: 'Дата решения заявки',
        accessorKey: 'dateSolution',
        type: 'string',
        maxSize: 160,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по дате решения',
        },
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        type: 'string',
        maxSize: 150,
        enableResizing: false,
        // Блокируем фильтр если есть URL параметры
        enableColumnFilter: !urlStatus,
        mantineFilterTextInputProps: {
          disabled: !!urlStatus,
          readOnly: !!urlStatus,
          placeholder: urlStatus ? `Зафиксировано: ${urlStatus}` : 'Фильтр по статусу',
        },
        mantineFilterSelectProps: {
          disabled: !!urlStatus || hideClosed,
          readOnly: !!urlStatus || hideClosed,
        },
      },
      {
        header: 'Заголовок',
        accessorKey: 'header',
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по заголовку',
        },
      },
      {
        header: 'Тип запроса',
        accessorKey: 'requestType',
        type: 'string',
        maxSize: 100,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по запросу',
        },
      },
      {
        header: 'Инициатор',
        accessorKey: 'initiator',
        type: 'string',
        maxSize: 150,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по инициатору',
        },
      },
      {
        header: 'Пользователь',
        accessorKey: 'user',
        type: 'string',
        maxSize: 150,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по пользователю',
        },
      },
      {
        header: 'IT-сервис (модуль)',
        accessorKey: 'itModule',
        type: 'string',
        maxSize: 150,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по IT-сервису',
        },
      },
      {
        header: 'Услуга',
        accessorKey: 'service',
        type: 'string',
        maxSize: 130,
        enableResizing: false,
        mantineFilterTextInputProps: {
          placeholder: 'Фильтр по услуге',
        },
      },
    ],
    [urlStatus],
  );

  // Цвет заливки строки
  const colorRow = (row: MRT_Row<Request>) => {
    if (row.getIsSelected())
    {
      return 'rgba(23, 139, 241, 0.2)';
    }

    // Получаем тип заявки из данных строки
    const requestType = row.original.requestType;
  
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
  const isRequestOverdue = (request: Request): boolean => {
    if (!request.dateDesired) return false;
    
    // Если заявка уже завершена не считаем просроченной
    const completedStatuses = ['Закрыта', 'Отклонена'];
    if (request.status && completedStatuses.includes(request.status)) {
      return false;
    }
    
    const desiredDate = parseDate(request.dateDesired.split(' ')[0]);
    
    // Если дата не распарсилась не считаем просроченной
    if (!desiredDate) return false;
    
    // Сравниваем с текущей датой (без времени)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return desiredDate < today;
  };

  // Обработчик двойного клика
  const handleRowDoubleClick = (row: MRT_Row<Request>) => {
    setSelectedRequest(row.original);
    setIsDialogOpen(true);
  };

  // Обработчик закрытия диалога
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType] = useState(0);

  // Создание таблицы
  const table = useMantineReactTable({
    columns: columns,
    data: filteredData,
    enableExpanding: false,
    enableTopToolbar:false,
    enableRowSelection:true,
    enableRowNumbers:false,
    enableMultiRowSelection:false,
    enableSelectAll:false,
    enableHiding:false,
    enableColumnResizing:true,
    layoutMode:'grid',
    columnResizeMode:'onChange',
    filterFromLeafRows:true,
    enableColumnActions:false,
    localization:MRT_Localization_RU,
    initialState:{
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 100 },
      columnVisibility: {'mrt-row-select': false},
      showColumnFilters:true,
    },
    state: {columnFilters},
    onColumnFiltersChange: handleFiltersChange,

    mantineTableProps: {
      fontSize: '11px',
    },

    mantineTableContainerProps: { sx: { minHeight: 150,maxHeight: 800 } },

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

    mantineTableBodyCellProps:({row}) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: {
        backgroundColor: colorRow(row),
        cursor: 'pointer',
        border: '1px solid #dde7ee',
        fontWeight: row.original.status === 'Новая' ? 'bold' : 'normal',
        color: isRequestOverdue(row.original) ? '#d32f2f' : 'inherit',
      }
    }),
    // Добавляем обработчик двойного клика на строку
    mantineTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => handleRowDoubleClick(row),
      sx: {
        cursor: 'pointer',
      },
    }),
  });
  
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
        <Grid2 container spacing={1} direction={'row'} alignItems="left" justifyContent="left">
          <Grid2 size="auto">
            <SplitButton
              buttonText={'Создать заявку'}
              menuItems={['Заявка на обслуживание', 'Заявка на доступ', 'Заявка на изменение', 'Инцидент']}
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
              Отклонить заявку
            </Button>
          </Grid2>
            <Grid2 size="auto">
            <Button
              variant="contained"
              color="warning"
              startIcon={<Note />}
              size={'small'}
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
            >
              Закрыть заявку
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
              size={'small'}
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
            >
              В Excel
            </Button>
          </Grid2>
          <Grid2 size="auto" alignContent="center">
            <MantineProvider theme={{cursorType: 'pointer'}}>
              <Checkbox
                disabled={urlStatus==="Новая" ? true : false}
                checked={hideClosed}
                onChange={(event) => setHideClosed(event.currentTarget.checked)}
                label="Скрыть закрытые заявки"
                size="md"
              />
            </MantineProvider>
          </Grid2>
        </Grid2>
      </Box>

      <MantineReactTable key={tableKey} table={table} />
      <SupportGeneralDialog
        isOpen={isDialogOpen}
        request={selectedRequest}
        onClose={handleDialogClose}
      />
    </div>
  );
}