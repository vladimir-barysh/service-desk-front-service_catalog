import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef,  MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { data, type Request } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

export function SupportAllPage() {
  const columns = useMemo<MRT_ColumnDef<Request>[]>(
    () => [
      {
        header: '№ заявки',
        accessorKey: 'requestNumber',
        maxSize: 110,
      },
      {
        header: 'Дата регистрации',
        accessorKey: 'dateRegistration',
        type: 'string',
        minSize: 170,
      },
      {
        header: 'Желаемый срок',
        accessorKey: 'dateDesired',
        type: 'string',
        width: 170,
      },
      {
        header: 'Дата решения заявки',
        accessorKey: 'dateSolution',
        type: 'string',
        width: 170,
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        type: 'string',
        width: 200,
      },
      {
        header: 'Заголовок',
        accessorKey: 'header',
        type: 'string',
        width: 150,
      },
      {
        header: 'Тип запроса',
        accessorKey: 'requestType',
        type: 'string',
        width: 160,
      },
      {
        header: 'Инициатор',
        accessorKey: 'initiator',
        type: 'string',
        width: 150,
      },
      {
        header: 'Пользователь',
        accessorKey: 'user',
        type: 'string',
        width: 150,
      },
      {
        header: 'IT-сервис (модуль)',
        accessorKey: 'itModule',
        type: 'string',
        width: 150,
      },
      {
        header: 'Услуга',
        accessorKey: 'service',
        type: 'string',
        width: 150,
      },
    ],
    [],
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

  const [requestType] = useState(0);

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  // Создание таблицы
  const table = useMantineReactTable({
    columns: columns,
    data: data,
    enableExpanding: false,
    enableTopToolbar:false,
    enableRowSelection:true,
    enableRowNumbers:false,
    enableMultiRowSelection:false,
    enableSelectAll:false,
    enableHiding:false,
    enableColumnResizing:true,
    filterFromLeafRows:true,
    enableColumnActions:false,
    localization:MRT_Localization_RU,
    initialState:{
      density: 'md',
      pagination: { pageIndex: 0, pageSize: 100 },
      columnVisibility: {'mrt-row-select': false},
      showColumnFilters:true,
    },
    mantineTableContainerProps: { sx: { maxHeight: 800 } },
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
  })

  return (
    <div>
        <Box height={50}>
        <Grid2 container spacing={2} direction={'row'} alignItems="left" justifyContent="left">
          <Grid2 size="auto">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              size={'small'}
            >
              Создать заявку
            </Button>
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
        </Grid2>
      </Box>
      <MantineReactTable
        table={table}
      />
    </div>
  );
}