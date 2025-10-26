import { useMemo } from 'react';
import { MantineReactTable, type MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { data, type Request } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Check, Clear, Build, Note } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
/* import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; */

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
    mantineTableBodyCellProps:
      {
        style: {
          border: '1px solid #dde7ee'
        }
      },
    mantineTableContainerProps:{ sx: { maxHeight: 800 } },
    mantineTableBodyRowProps:({row}) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: {
        cursor: 'pointer'
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
        </Grid2>
      </Box>
      <MantineReactTable
        table={table}
      />
{/*       <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{width: '100%'}}
        >
          Заявка не выбрана
        </Alert>
      </Snackbar> */}
    </div>
  );
}