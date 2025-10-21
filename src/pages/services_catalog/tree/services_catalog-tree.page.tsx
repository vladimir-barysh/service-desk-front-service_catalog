import { useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { MantineReactTable, type MRT_ColumnDef, MRT_Row, useMantineReactTable } from 'mantine-react-table';
import { data, rolesEdit, type Service, servicesAll, servicesChoose, worktypes } from './makeData';
import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { Add, Edit, Delete, Save } from '@mui/icons-material';
import SplitButton from '../../../components/split-button/split-button.component';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { dataClass, DeleteDialog, ItcatalogCreateDialog, ItservicesCreateDialog } from '../../../components';
import { rolesTableDataClass } from '../../../components/itcatalog-create-dialog/makeData';
import { rolesCreate } from '../itcatalog/makeData';
import { tableClass } from '../../../components/table-as-list/tableClass';

export function ServicesCatalogTreePage () {

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
        width: 250,
      },
      {
        header: 'Разработчик',
        accessorKey: 'developer',
        type: 'string',
        width: 170,
      },
      {
        header: 'Дата ввода',
        accessorKey: 'dateStart',
        type: 'string',
        maxSize: 100,
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        type: 'string',
        maxSize: 75,
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
    ],
    [],
  );

  const humansAll = ['Мелихова Марина Вячеславовна','Петров Александр Аркадьевич', 'Гусев Алексей Сергеевич'];
// eslint-disable-next-line no-unused-vars
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
        enableEditing: false,
      },
      {
        header: 'Тип работы',
        accessorKey: 'typeName',
        type: 'string',
        minSize: 100,
        enableEditing: false,
      },
      {
        header: 'Группа',
        accessorKey: 'groupName',
        type: 'string',
        minSize: 100,
        enableEditing: false,
      },
      {
        header: 'Примечание',
        accessorKey: 'note',
        type: 'string',
        minSize: 200,
        enableEditing: false,
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
  const [roles, setRoles] = useState<rolesTableDataClass[]>([]);
  const [open, setOpen] = React.useState(false);
  const [requestType, setRequestType] = useState(0);
  const [isItCatalogCreateDialogOpen, setIsItCatalogCreateDialogOpen] = useState(false);
  const [isItServiceCreateDialogOpen, setIsItServiceCreateDialogOpen] = useState(false);
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
  const [subParent, setSubParent] = useState<string>("None");
  const [subServiceType, setSubServiceType] = useState<string>("None");
  const [subServiceName, setSubServiceName] = useState<string>("None");
  const [subServiceShortName, setSubServiceShortName] = useState<string>("None");
  const [subDescription, setSubDescription] = useState<string>("None");
  const [subStartPurpose, setSubStartPurpose] = useState<string>("None");
  const [subDeveloperName, setSubDeveloperName] = useState<string>("None");
  const [subDateStart, setSubDateStart] = useState<Date | null>(null);
  const [subEndPurpose, setSubEndPurpose] = useState<string>("None");
  const [subDateEnd, setSubDateEnd] = useState<Date | null>(null);
  const [subStatus, setSubStatus] = useState<string>("None");
  const [subIsIS, setSubIsIS] = useState<boolean>(false);
  const [subIsHasCoordinate, setSubIsHasCoordinate] = useState<boolean>(false);
  const [subIsService, setSubIsService] = useState<boolean>(false);
  const [subCriticalValue, setSubCriticalValue] = useState<number>(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [DeleteDialogTypeName, setDeleteDialogTypeName] = useState<string | undefined>("None");
  const [ErrorNotificationText, setErrorNotificationText] = useState<string | undefined>("None");

  let TableRoles: tableClass;
  TableRoles = new tableClass(roles, rolesColumns);
  let TableWorkTypes: tableClass;
  TableWorkTypes = new tableClass(worktypes, worktypesColumns);
  let TableServicesAll: tableClass;
  TableServicesAll = new tableClass(servicesAll, getColumns("Доступно"));
  let TableServicesChoose: tableClass;
  TableServicesChoose = new tableClass(servicesChoose, getColumns("Выбрано"));

  function parseDate(dateString: string): Date | null {
    const parts = dateString.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
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
      TableRoles.setTableData(rolesCreate);
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
      TableRoles.setTableData(rolesEdit);
      setIsItCatalogCreateDialogOpen(true);
    }
  }

  const onItCatalogCreateDialogClose = () => {
    setIsItCatalogCreateDialogOpen(false);
  }


  function createItService(mode: string)
  {
    const dict = table.getState().rowSelection;
    const keys = Object.keys(dict);
    if (mode === "new")
    {
      setSubParent("");
      setSubServiceType("");
      setSubServiceName("");
      setSubDescription("");
      setSubStartPurpose("");
      setSubDateStart(null);
      setSubEndPurpose("");
      setSubDateEnd(null);
      setSubStatus("");
      setSubServiceShortName("");
      setSubDeveloperName("");
      setSubIsIS(false);
      setSubIsHasCoordinate(false);
      setSubIsService(false);
      setSubCriticalValue(0);
      setIsItServiceCreateDialogOpen(true);
    }
    else if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали Сервис (ИС)")
      handleClick();
    }
    else
    {
      if(table.getRow(keys[0])['parentId']===undefined)
        setSubParent("");
      else
        // @ts-ignore
        setSubParent(table.getRow(table.getRow(keys[0])['parentId'])['original']['serviceName']);
      // @ts-ignore
      setSubServiceType(table.getRow(keys[0])['original']['serviceType']);
      // @ts-ignore
      setSubServiceName(table.getRow(keys[0])['original']['serviceName']);
      // @ts-ignore
      setSubServiceShortName(table.getRow(keys[0])['original']['serviceShortName']);
      // @ts-ignore
      setSubDescription(table.getRow(keys[0])['original']['description']);
      // @ts-ignore
      setSubStartPurpose(table.getRow(keys[0])['original']['startPurpose']);
      // @ts-ignore
      setSubDeveloperName(table.getRow(keys[0])['original']['developerName']);
      // @ts-ignore
      setSubDateStart(parseDate(table.getRow(keys[0])['original']['dateStart']));
      // @ts-ignore
      setSubEndPurpose(table.getRow(keys[0])['original']['endPurpose']);
      // @ts-ignore
      setSubDateEnd(parseDate(table.getRow(keys[0])['original']['dateEnd']));
      // @ts-ignore
      setSubStatus(table.getRow(keys[0])['original']['status']);
      // @ts-ignore
      setSubIsIS(table.getRow(keys[0])['original']['isIS']);
      // @ts-ignore
      setSubIsHasCoordinate(table.getRow(keys[0])['original']['isHasCoordinate']);
      // @ts-ignore
      setSubIsService(table.getRow(keys[0])['original']['isService']);
      // @ts-ignore
      setSubCriticalValue(table.getRow(keys[0])['original']['criticalValue']);

      setIsItServiceCreateDialogOpen(true);
    }
  }

  const onItServiceCreateDialogClose = () => {
    setIsItServiceCreateDialogOpen(false);
  }


  const onRequestTypeSelect = (selected: any) => {
    setRequestType(selected);
    if (selected==="Услуга")
    {
      createItCatalog("new")
    }
    else
    {
      createItService("new")
    }
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
  ) => {

    setOpen(false);
  };


  function editItService()
  {
    const dict = table.getState().rowSelection;
    const keys = Object.keys(dict);
    if (keys[0]===undefined)
    {
      setErrorNotificationText("Вы не выбрали ИТ-услугу")
      handleClick();
    }
    else
    {
      console.log(table.getRow(keys[0])['parentId'])
      if (table.getRow(keys[0])['parentId'] === undefined)
      {
        createItCatalog("edit");
      }
      else
      {
        createItService("edit");
      }
    }
  }


  function deleteItService()
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
    displayColumnDefOptions: {'mrt-row-expand': {mantineTableBodyCellProps: ({row}) => ({sx : { paddingLeft: "0.625rem", backgroundColor: colorRow(row), }})}},
    initialState:{
      density: 'xs',
      pagination: { pageIndex: 0, pageSize: 50 },
      columnVisibility: {'mrt-row-select': false},
      showColumnFilters:true,
    },
    mantineTableContainerProps:{ sx: { maxHeight: 800 } },
    mantineTableBodyCellProps:({row}) => ({
      sx: {
        cursor: 'pointer',
        backgroundColor: colorRow(row),
        border: '1px solid #dde7ee',
      },
      onClick: row.getToggleSelectedHandler(),
    }),
  })

  return (
    <div>
      <Box height={50}>
    <Grid2 container spacing={2} direction={'row'}>
      <Grid2 size="auto" color={'primary'}>
        <SplitButton
          buttonText={'Создать объект'}
          menuItems={['Услуга', 'Сервис/Модуль']}
          startIcon={<Add />}
          size={'small'}
          onSelect={onRequestTypeSelect}
        />
      </Grid2>
      <Grid2 size={2}>
        <Button
          variant="contained"
          color="warning"
          startIcon={<Edit />}
          size={'small'}
          fullWidth={true}
          onClick={() => editItService()}
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
          onClick={() => deleteItService()}
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
      <ItservicesCreateDialog
        isOpen={isItServiceCreateDialogOpen}
        parent={subParent}
        serviceType={subServiceType}
        serviceName={subServiceName}
        serviceShortName={subServiceShortName}
        description={subDescription}
        startPurpose={subStartPurpose}
        developerName={subDeveloperName}
        endPurpose={subEndPurpose}
        dateEnd={subDateEnd}
        dateStart={subDateStart}
        status={subStatus}
        isIS={subIsIS}
        isHasCoordinate={subIsHasCoordinate}
        isService={subIsService}
        criticalValue={subCriticalValue}
        onClose={onItServiceCreateDialogClose}
        setServiceType={setSubServiceType}
        setIsIs={setSubIsIS}
        setServiceName={setSubServiceName}
        setStatus={setSubStatus}
        setIsService={setSubIsService}
        setDescription={setSubDescription}
        setServiceShortName={setSubServiceShortName}
        setIsHasCoordinate={setSubIsHasCoordinate}
        setCriticalValue={setSubCriticalValue}
        setDateValue={setSubDateStart}
        setEndPurpose={setSubEndPurpose}
        setStartPurpose={setSubStartPurpose}
        setParent={setSubParent}
        setDeveloperName={setSubDeveloperName}
        setOutDateValue={setSubDateEnd}
      />
    </div>
  );
}