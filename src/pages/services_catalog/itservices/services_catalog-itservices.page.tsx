import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { data, type Service } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Edit, Delete, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DeleteDialog, ItservicesCreateDialog } from '../../../components';


export function ServicesCatalogItServicesPage () {

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'serviceName',
        type: 'string',
        width: 400,
      },
      {
        header: 'Дата ввода в эксплуатацию',
        accessorKey: 'dateStart',
        type: 'string',
        width: 170,
      },
      {
        header: 'Дата вывода из эксплуатации',
        accessorKey: 'dateEnd',
        type: 'string',
        width: 170,
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        type: 'string',
        width: 150,
      },
    ],
    [],
  );

  const [requestType] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [isItCatalogCreateDialogOpen, setIsItCatalogCreateDialogOpen] = useState(false);
  const [parent, setParent] = useState<string>("None");
  const [serviceType, setServiceType] = useState<string>("None");
  const [serviceName, setServiceName] = useState<string>("None");
  const [serviceShortName, setServiceShortName] = useState<string>("None");
  const [description, setDescription] = useState<string>("None");
  const [startPurpose, setStartPurpose] = useState<string>("None");
  const [developerName, setDeveloperName] = useState<string>("None");
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [endPurpose, setEndPurpose] = useState<string>("None");
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("None");
  const [isIS, setIsIS] = useState<boolean>(false);
  const [isHasCoordinate, setIsHasCoordinate] = useState<boolean>(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [criticalValue, setCriticalValue] = useState<number>(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const [ErrorNotificationText, setErrorNotificationText] = useState<string | undefined>("None");

  function parseDate(dateString: string): Date | null {
    const parts = dateString.split('.');
    if (parts.length !== 3) {
      return null; // Invalid format
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null; // Invalid number
    }

    return new Date(year, month, day);
  }


  function createItCatalog(mode: string)
  {
    const dict = table.getState().rowSelection;
    const keys = Object.keys(dict);
    if (mode === "new")
    {
      setParent("");
      setServiceType("");
      setServiceName("");
      setDescription("");
      setStartPurpose("");
      setDateStart(null);
      setEndPurpose("");
      setDateEnd(null);
      setStatus("");
      setServiceShortName("");
      setDeveloperName("");
      setIsIS(false);
      setIsHasCoordinate(false);
      setIsService(false);
      setCriticalValue(0);
      setIsItCatalogCreateDialogOpen(true);
    }
    else if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали Сервис (ИС)")
      handleClick();
    }
    else
    {
      if(table.getRow(keys[0])['parentId']===undefined)
        setParent("");
      else
        // @ts-ignore
        setParent(table.getRow(table.getRow(keys[0])['parentId'])['original']['serviceName']);
      // @ts-ignore
      setServiceType(table.getRow(keys[0])['original']['serviceType']);
      // @ts-ignore
      setServiceName(table.getRow(keys[0])['original']['serviceName']);
      // @ts-ignore
      setServiceShortName(table.getRow(keys[0])['original']['serviceShortName']);
      // @ts-ignore
      setDescription(table.getRow(keys[0])['original']['description']);
      // @ts-ignore
      setStartPurpose(table.getRow(keys[0])['original']['startPurpose']);
      // @ts-ignore
      setDeveloperName(table.getRow(keys[0])['original']['developerName']);
      // @ts-ignore
      setDateStart(parseDate(table.getRow(keys[0])['original']['dateStart']));
      // @ts-ignore
      setEndPurpose(table.getRow(keys[0])['original']['endPurpose']);
      // @ts-ignore
      setDateEnd(parseDate(table.getRow(keys[0])['original']['dateEnd']));
      // @ts-ignore
      setStatus(table.getRow(keys[0])['original']['status']);
      // @ts-ignore
      setIsIS(table.getRow(keys[0])['original']['isIS']);
      // @ts-ignore
      setIsHasCoordinate(table.getRow(keys[0])['original']['isHasCoordinate']);
      // @ts-ignore
      setIsService(table.getRow(keys[0])['original']['isService']);
      // @ts-ignore
      setCriticalValue(table.getRow(keys[0])['original']['criticalValue']);

      setIsItCatalogCreateDialogOpen(true);
    }
  }

  const onItCatalogCreateDialogClose = () => {
    setIsItCatalogCreateDialogOpen(false);
  }


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
  ) => {
    setOpen(false);
  };

  function deleteItServiceRu()
  {
    const dict = table.getState().rowSelection;
    const keys = Object.keys(dict);
    if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали Сервис (ИС)")
      handleClick();
    }
    else { // @ts-ignore
      if (table.getRow(keys[0])["originalSubRows"].length > 0)
      {
        setErrorNotificationText("Нельзя удалить: присутствуют дочерние элементы")
        handleClick();
      }
      else
      {
        setDeleteDialogTypeName(table.getRow(keys[0])['original']['serviceName']);
        setIsDeleteDialogOpen(true);
      }
    }
  }

  const onDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  }

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  const colorRow = (row: MRT_Row<Service>) => {
    if (row.getIsSelected())
    {
      return 'rgba(34,139,230,0.2)';
    }
    else if (row.getCanExpand())
    {
      return 'lightgray';
    }
    else return 'white';
  };

  const table = useMantineReactTable({
    columns: columns,
    data: data,
    enableExpanding: true,
    enableTopToolbar:false,
    enableRowSelection:true,
    enableMultiRowSelection:false,
    enableSelectAll:false,
    enableHiding:false,
    enableColumnResizing:true,
    filterFromLeafRows:true,
    enableSubRowSelection: false,
    enableColumnActions:false,
    localization:MRT_Localization_RU,
    initialState:{
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 50 },
      columnVisibility: {'mrt-row-select': false},
      showColumnFilters:true,
    },
    displayColumnDefOptions: {'mrt-row-expand': {mantineTableBodyCellProps: ({row}) => ({sx : { paddingLeft: "0.625rem", backgroundColor: colorRow(row), }})}},
    mantineTableContainerProps:{ sx: { maxHeight: 800 } },
    mantineTableBodyCellProps:({row}) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: {
        backgroundColor: colorRow(row),
        cursor: 'pointer',
        border: '1px solid #dde7ee',
      }
    }),
  })

  return (
    <div>
      <Box height={50}>
    <Grid2 container spacing={2} direction={'row'}>
      <Grid2 size={2} color={'primary'}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size={'small'}
          fullWidth={true}
          onClick={() => createItCatalog("new")}
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
          onClick={() => createItCatalog("edit")}
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
          onClick={() => deleteItServiceRu()}
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
          {ErrorNotificationText}
        </Alert>
      </Snackbar>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        pageName="Сервис (ИС)"
        typeName={DeleteDialogTypeName}
        onClose={onDeleteDialogClose}
      />
      <ItservicesCreateDialog
        isOpen={isItCatalogCreateDialogOpen}
        parent={parent}
        serviceType={serviceType}
        serviceName={serviceName}
        serviceShortName={serviceShortName}
        description={description}
        startPurpose={startPurpose}
        developerName={developerName}
        endPurpose={endPurpose}
        dateEnd={dateEnd}
        dateStart={dateStart}
        status={status}
        isIS={isIS}
        isHasCoordinate={isHasCoordinate}
        isService={isService}
        criticalValue={criticalValue}
        onClose={onItCatalogCreateDialogClose}
        setServiceType={setServiceType}
        setIsIs={setIsIS}
        setServiceName={setServiceName}
        setStatus={setStatus}
        setIsService={setIsService}
        setDescription={setDescription}
        setServiceShortName={setServiceShortName}
        setIsHasCoordinate={setIsHasCoordinate}
        setCriticalValue={setCriticalValue}
        setDateValue={setDateStart}
        setEndPurpose={setEndPurpose}
        setStartPurpose={setStartPurpose}
        setParent={setParent}
        setDeveloperName={setDeveloperName}
        setOutDateValue={setDateEnd}
      />
    </div>
  );
}

