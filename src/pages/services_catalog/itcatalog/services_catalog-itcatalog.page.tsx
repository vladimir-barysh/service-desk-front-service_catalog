import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { data, type Service, rolesEdit, rolesCreate, servicesAll, servicesChoose, worktypes } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Edit, Delete, Save } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { dataClass, DeleteDialog, ItcatalogCreateDialog } from '../../../components';
import { type rolesTableDataClass } from '../../../components/itcatalog-create-dialog/makeData';
import { tableClass } from '../../../components/table-as-list/tableClass';

export function ServicesCatalogItCatalogPage () {

  const columns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: '№ услуги',
        accessorKey: 'serviceNumber',
        maxSize: 100,
      },
      {
        header: 'Наименование услуги',
        accessorKey: 'serviceName',
        type: 'string',
        width: 400,
      },
      {
        header: 'Основание для ввода',
        accessorKey: 'startPurpose',
        type: 'string',
        width: 200,
      },
      {
        header: 'Дата ввода',
        accessorKey: 'dateStart',
        type: 'string',
        maxSize: 100,
      },
      {
        header: 'Основание для вывода',
        accessorKey: 'endPurpose',
        type: 'string',
        width: 200,
      },
      {
        header: 'Дата вывода',
        accessorKey: 'dateEnd',
        type: 'string',
        maxSize: 100,
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        type: 'string',
        maxSize: 65,
      },
      {
        header: 'Масштаб',
        accessorKey: 'scale',
        type: 'string',
        maxSize: 100,
      },
      {
        header: 'Влияние',
        accessorKey: 'influence',
        type: 'string',
        maxSize: 100,
      },
    ],
    [],
  );

  const humansAll = ['Мелихова Марина Вячеславовна','Петров Александр Аркадьевич', 'Гусев Алексей Сергеевич'];
  //const humansAll = ['1','2','3'];
  const rolesColumns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Подразделение',
        accessorKey: 'department',
        type: 'string',
        minSize: 400,
        enableEditing: false,
      },
      {
        header: 'Роль',
        accessorKey: 'role',
        type: 'string',
        minSize: 100,
        enableEditing: false,
      },
      {
        header: 'Наименование',
        accessorKey: 'roleName',
        editVariant: 'select',
        minSize: 350,
        mantineEditSelectProps: { data: humansAll, zIndex:10000, },
        enableColumnActions: true,

      },
    ],
    [],
  );

  const worktypesColumns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Подразделение',
        accessorKey: 'departmentName',
        type: 'string',
        minSize: 300,
      },
      {
        header: 'Тип работы',
        accessorKey: 'typeName',
        type: 'string',
        minSize: 100,
      },
      {
        header: 'Группа',
        accessorKey: 'groupName',
        type: 'string',
        minSize: 100,
      },
      {
        header: 'Примечание',
        accessorKey: 'note',
        type: 'string',
        minSize: 200,
      },
    ],
    [],
  );

  const getColumns  = (name:string) => useMemo<MRT_ColumnDef<dataClass>[]>(
    () => [
      {
        header: name,
        accessorKey: 'mainName',
        type: 'string',
        minSize: 200,
        enableEditing: false,
      },
    ],
    [],
  );

// eslint-disable-next-line no-unused-vars
  const [roles, setRoles] = useState<rolesTableDataClass[]>(rolesCreate);
  const [requestType] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [isItCatalogCreateDialogOpen, setIsItCatalogCreateDialogOpen] = useState(false);
  const [mainParent, setMainParent] = useState<string>("None");
  const [mainServiceNumber, setMainServiceNumber] = useState<string>("None");
  const [mainServiceName, setMainServiceName] = useState<string>("None");
  const [mainDescription, setMainDescription] = useState<string>("None");
  const [mainStartPurpose, setMainStartPurpose] = useState<string>("None");
  const [mainDateStart, setMainDateStart] = useState<Date | null>(null);
  const [mainEndPurpose, setMainEndPurpose] = useState<string>("None");
  const [mainDateEnd, setMainDateEnd] = useState<Date | null>(null);
  const [mainStatus, setMainStatus] = useState<string>("None");
  const [mainScale, setMainScale] = useState<string>("None");
  const [mainInfluence, setMainInfluence] = useState<string>("None");
  const [mainAdditionalInformation, setMainAdditionalInformation] = useState<string>("None");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const [ErrorNotificationText, setErrorNotificationText] = useState<string | undefined>("None");

  const TableRoles = new tableClass(roles, rolesColumns);
  const TableWorkTypes = new tableClass(worktypes, worktypesColumns);
  const TableServicesAll = new tableClass(servicesAll, getColumns("Доступно"));
  const TableServicesChoose = new tableClass(servicesChoose, getColumns("Выбрано"));

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
      setMainParent("");
      TableRoles.setTableData(rolesCreate);
      //setServiceNumber(get_from_db_function);
      setMainServiceNumber("get_from_db_function()");
      setMainServiceName("");
      setMainDescription("");
      setMainStartPurpose("");
      setMainDateStart(null);
      setMainEndPurpose("");
      setMainDateEnd(null);
      setMainStatus("");
      setMainScale("");
      setMainInfluence("");
      setMainAdditionalInformation("");
      setIsItCatalogCreateDialogOpen(true);
    }
    else if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали ИТ-услугу")
      handleClick();
    }
    else
    {
      if(table.getRow(keys[0])['parentId']===undefined)
        setMainParent("");
      else
        // @ts-ignore
        setMainParent(table.getRow(table.getRow(keys[0])['parentId'])['original']['serviceName']);
      TableRoles.setTableData(rolesEdit);
      // @ts-ignore
      setMainServiceNumber(table.getRow(keys[0])['original']['serviceNumber']);
      // @ts-ignore
      setMainServiceName(table.getRow(keys[0])['original']['serviceName']);
      // @ts-ignore
      setMainDescription(table.getRow(keys[0])['original']['description']);
      // @ts-ignore
      setMainStartPurpose(table.getRow(keys[0])['original']['startPurpose']);
      // @ts-ignore
      setMainDateStart(parseDate(table.getRow(keys[0])['original']['dateStart']));
      // @ts-ignore
      setMainEndPurpose(table.getRow(keys[0])['original']['endPurpose']);
      // @ts-ignore
      setMainDateEnd(parseDate(table.getRow(keys[0])['original']['dateEnd']));
      // @ts-ignore
      setMainStatus(table.getRow(keys[0])['original']['status']);
      // @ts-ignore
      setMainScale(table.getRow(keys[0])['original']['scale']);
      // @ts-ignore
      setMainInfluence(table.getRow(keys[0])['original']['influence']);
      // @ts-ignore
      setMainAdditionalInformation(table.getRow(keys[0])['original']['additionalInformation']);
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

  function deleteItServiceEn()
  {
    const dict = table.getState().rowSelection;
    const keys = Object.keys(dict);
    if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали ИТ-услугу")
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
    <Grid2 container spacing={2} direction={'row'} >
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
          onClick={() => deleteItServiceEn()}
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
        pageName="ИТ-услуга"
        typeName={DeleteDialogTypeName}
        onClose={onDeleteDialogClose}
      />
      <ItcatalogCreateDialog
        isOpen={isItCatalogCreateDialogOpen}
        parent={mainParent}
        serviceNumber={mainServiceNumber}
        serviceName={mainServiceName}
        description={mainDescription}
        startPurpose={mainStartPurpose}
        endPurpose={mainEndPurpose}
        dateEnd={mainDateEnd}
        dateStart={mainDateStart}
        setDateValue={setMainDateStart}
        setOutDateValue={setMainDateEnd}
        status={mainStatus}
        scale={mainScale}
        influence={mainInfluence}
        additionalInformation={mainAdditionalInformation}
        tableRoles={TableRoles}
        onClose={onItCatalogCreateDialogClose}
        tableServicesAll={TableServicesAll}
        tableServicesChoose={TableServicesChoose}
        tableWorkTypes={TableWorkTypes}
        setScale={setMainScale}
        setInfluence={setMainInfluence}
        setStatus={setMainStatus}
        setServiceName={setMainServiceName}
        setEndPurpose={setMainEndPurpose}
        setStartPurpose={setMainStartPurpose}
        setDescription={setMainDescription}
        setAdditionalInformation={setMainAdditionalInformation}
        setServiceNumber={setMainServiceNumber}
        setParent={setMainParent}
      />
    </div>
  );
}

