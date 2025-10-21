import { useMemo } from 'react';
import { MantineReactTable, type MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { data, type Service } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { Select, Text } from '@mantine/core';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DeleteDialog } from '../../../components';
import { HistoryFixationCreateDialog } from '../../../components/history-fixation-create-dialog';



export function ServicesCatalogHistoryPage () {

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: '№',
        accessorKey: 'serviceNumber',
        maxSize: 100,
      },
      {
        header: 'Наименование',
        accessorKey: 'serviceName',
        type: 'string',
        minSize: 400,
      },
      {
        header: 'Описание',
        accessorKey: 'description',
        type: 'string',
        width: 170,
      },
      {
        header: 'Общество',
        accessorKey: 'companyName',
        type: 'string',
        width: 170,
      },
      {
        header: 'Подразделение',
        accessorKey: 'departmentName',
        type: 'string',
        width: 170,
      },
      {
        header: 'ФИО',
        accessorKey: 'fio',
        type: 'string',
        width: 170,
      },
      {
        header: 'Куратор',
        accessorKey: 'curator',
        type: 'string',
        width: 170,
      },
      {
        header: 'Сервис-менеджер',
        accessorKey: 'manager',
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
        header: 'Основание',
        accessorKey: 'reason',
        type: 'string',
        width: 200,
      },
      {
        header: 'Дата ввода',
        accessorKey: 'dateStart',
        type: 'string',
        width: 170,
      },
      {
        header: 'Масштаб',
        accessorKey: 'scale',
        type: 'string',
        width: 100,
      },
      {
        header: 'Влияние',
        accessorKey: 'influence',
        type: 'string',
        width: 100,
      },
      {
        header: 'Доп. информация',
        accessorKey: 'additionalInformation',
        type: 'string',
        minSize: 500,
      },
    ],
    [],
  );

  const [requestType] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFixationCreateDialogOpen, setIsFixationCreateDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const fixationData = ['Актуализация Каталога ИТ-услуг 05.2024 от 24.05.2024', 'отправлено 18.10.2018 от 18.10.2018', 'Отправлено 18.10.2018 от 18.10.2018', '18.10.2019 от 22.11.2019', 'null от 27.08.2021', 'изменены Сервис менеджеры от 04.09.2019', 'Выгрузка Интер РАО от 24.07.2020'];

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
  ) => {

    setOpen(false);
  };

  function deleteFixation()
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      setDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['serviceName'] + " (" +  table.getSelectedRowModel().rows[0]['original']['serviceNumber'] + ")");
      setIsDeleteDialogOpen(true);
    }
  }

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  }

  const onFixationCreateDialogClose = () => {
    setIsFixationCreateDialogOpen(false);
  }

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  const table = useMantineReactTable({
    columns: columns,
    data: data,
    enableExpanding: false,
    enableTopToolbar:false,
    enableRowSelection:true,
    enableRowNumbers:true,
    enableMultiRowSelection:false,
    enableSelectAll:false,
    enableHiding:false,
    enableColumnResizing:true,
    filterFromLeafRows:true,
    enableColumnActions:false,
    localization:MRT_Localization_RU,
    initialState:{
      density: 'md',
      pagination: { pageIndex: 0, pageSize: 50 },
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
    <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" >
      <Grid2 size={2} offset={{md:0}}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size={'small'}
          fullWidth={true}
          onClick={() => setIsFixationCreateDialogOpen(true)}
        >
          Создать фиксацию
        </Button>
      </Grid2>
      <Grid2 container spacing={2} size={10} direction={'row'} alignItems="left" justifyContent="left">
      <Grid2 container size={2} alignItems="center" justifyContent="center">
        <Text>
        Посмотреть сохраненные:
        </Text>
      </Grid2>
      <Grid2 size={3} offset={{md:0}}>
      <Select
        size="xs"
        data={fixationData}
        maxDropdownHeight={200}
        limit={200}
        searchable={true}
        clearable={true}
      />
      </Grid2>
        <Grid2 size={1} offset={{md:0}}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            size={'small'}
            onClick={deleteFixation}
          >
            Удалить
          </Button>
        </Grid2>
        <Grid2 size={2} offset={{md:0.1}}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Save />}
            size={'small'}
          >
            В Excel
          </Button>
        </Grid2>
      </Grid2>
      </Grid2>
      </Box>
      <MantineReactTable
        table={table}
      />
      <Snackbar
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
          Вы не выбрали фиксацию
        </Alert>
      </Snackbar>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        pageName="фиксация"
        typeName={DeleteDialogTypeName}
        onClose={onDeleteDialogClose}
      />
      <HistoryFixationCreateDialog
        isOpen={isFixationCreateDialogOpen}
        onClose={onFixationCreateDialogClose}
      />
    </div>
  );
}

