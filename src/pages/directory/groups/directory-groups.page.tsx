import { useMemo } from 'react';
import { MantineReactTable, type MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { data, type Service } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { DeleteDialog, GroupCreateDialog } from '../../../components';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function DirectoryGroupsPage () {
  const [requestType] = useState(0);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const [isGroupCreateDialogOpen, setIsGroupCreateDialogOpen] = useState(false);
  const [GroupName, setGroupName] = useState<string>("None");
  const [GroupDescription, setGroupDescription] = useState<string>("None");

  const showError = () => {
    setErrorOpen(true);
  };

  const closeError = (
  ) => {
    setErrorOpen(false);
  };

  function deleteGroup()
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      showError();
    }
    else
    {
      setDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['groupName']);
      setIsDeleteDialogOpen(true);
    }
  }

  function createGroup(mode: string)
  {
    if (mode === "new")
    {
      setGroupDescription("");
      setGroupName("");
      setIsGroupCreateDialogOpen(true);
    }
    else if (table.getSelectedRowModel().rows.length === 0)
    {
      showError();
    }
    else
    {
      const group_name = table.getSelectedRowModel().rows[0]['original']['groupName'];
      const group_description = table.getSelectedRowModel().rows[0]['original']['description'];
      // @ts-ignore
      setGroupDescription(group_description);
      // @ts-ignore
      setGroupName(group_name);
      setIsGroupCreateDialogOpen(true);
    }
  }

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  }

  const onGroupCreateDialogClose = () => {
    setIsGroupCreateDialogOpen(false);
  }

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'groupName',
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
      showColumnFilters:true,
      columnVisibility: {'mrt-row-select': false},
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
        <Grid2 container spacing={2} direction={'row'} >
          <Grid2 size={2} color={'primary'}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              size={'small'}
              fullWidth={true}
              onClick={() => createGroup("new")}
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
              onClick={() => createGroup("edit")}
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
              onClick={deleteGroup}
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
          Вы не выбрали группу
        </Alert>
      </Snackbar>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        pageName="группа"
        typeName={DeleteDialogTypeName}
        onClose={onDeleteDialogClose}
      />
      <GroupCreateDialog
        isOpen={isGroupCreateDialogOpen}
        groupName={GroupName}
        groupDescription={GroupDescription}
        onClose={onGroupCreateDialogClose}
      />
    </div>
  );
}