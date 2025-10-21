import { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { data, type Service } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DeleteDialog, WorktypeCreateDialog } from '../../../components';

export function DirectoryWorktypesPage () {
  const [requestType] = useState(0);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const [isWorkTypeCreateDialogOpen, setIsWorkTypeCreateDialogOpen] = useState(false);
  const [WorkTypeName, setWorkTypeName] = useState<string>("None");
  const [WorkTypeDescription, setWorkTypeDescription] = useState<string>("None");

  const showError = () => {
    setErrorOpen(true);
  };

  const closeError = (
  ) => {

    setErrorOpen(false);
  };

  function deleteWorkType()
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      showError();
    }
    else
    {
      setDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['worktypeName']);
      setIsDeleteDialogOpen(true);
    }
  }

  function createWorkType(mode: string)
  {
    if (mode === "new")
    {
      setWorkTypeDescription("");
      setWorkTypeName("");
      setIsWorkTypeCreateDialogOpen(true);
    }
    else if (table.getSelectedRowModel().rows.length === 0)
    {
      showError();
    }
    else
    {
      const worktype_name = table.getSelectedRowModel().rows[0]['original']['worktypeName'];
      const worktype_description = table.getSelectedRowModel().rows[0]['original']['description'];
      // @ts-ignore
      setWorkTypeDescription(worktype_description);
      // @ts-ignore
      setWorkTypeName(worktype_name);
      setIsWorkTypeCreateDialogOpen(true);
    }
  }

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  }

  const onWorkTypeCreateDialogClose = () => {
    setIsWorkTypeCreateDialogOpen(false);
  }

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'worktypeName',
        type: 'string',
        minSize: 200,
      },
      {
        header: 'Описание',
        accessorKey: 'description',
        type: 'string',
        minSize: 400,
      },
    ],
    [],
  );

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
      density: 'xs',
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
        <Grid2 container spacing={2} direction={'row'}>
          <Grid2 size={2} >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              size={'small'}
              fullWidth={true}
              onClick={() => createWorkType("new")}
            >
              Создать
            </Button>
          </Grid2>
          <Grid2 size={2}>
            <Button
              variant="contained"
              color="warning"
              startIcon={<Edit />}
              size={'small'}
              fullWidth={true}
              onClick={() => createWorkType("edit")}
            >
              Редактировать
            </Button>
          </Grid2>
          <Grid2 size={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              size={'small'}
              fullWidth={true}
              onClick={() => deleteWorkType()}
            >
              Удалить
            </Button>
          </Grid2>
          <Grid2 size={2} offset={{md:"auto"}}>
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
      <Snackbar
        open={errorOpen}
        autoHideDuration={5000}
        onClose={closeError}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert
          onClose={closeError}
          severity="error"
          variant="filled"
          sx={{width: '100%'}}
        >
          Вы не выбрали тип работ
        </Alert>
      </Snackbar>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        pageName="тип работ"
        typeName={DeleteDialogTypeName}
        onClose={onDeleteDialogClose}
      />
      <WorktypeCreateDialog
        isOpen={isWorkTypeCreateDialogOpen}
        workTypeName={WorkTypeName}
        workTypeDescription={WorkTypeDescription}
        onClose={onWorkTypeCreateDialogClose}
      />
    </div>
  );
}