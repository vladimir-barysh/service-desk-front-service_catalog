import React, { useMemo, useState } from 'react';
import 'dayjs/locale/ru';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid2,
  Box,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { servicesAll, servicesChoose, roles, worktypes, rights } from './makeData';
// eslint-disable-next-line no-unused-vars
import { MRT_TableInstance, type MRT_ColumnDef } from 'mantine-react-table';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { tableClass } from '../table-as-list/tableClass';
import { dataClass } from '../table-as-list';
import type { Service } from '../../pages/directory/groups/makeData';
import { DeleteDialog } from '../delete-dialog';
import { RoleCreateDialog } from '../role-create-dialog';
import { ItcatalogWorktypeCreateDialog } from '../itcatalog-worktype-create-dialog';
import { ItcatalogSecondTab, ItcatalogThirdTab } from '../itcatalog-tabs';
import { ItservicesFirstTab } from '../itcatalog-tabs/itservices-create-dialog-first-tab';
import { AccessRightCreateDialog } from '../access-right-create-dialog';


export const ItservicesCreateDialog = (props: {
  isOpen: boolean;
  parent: string;
  setParent: any;
  serviceType: string;
  setServiceType: any;
  serviceName: string;
  setServiceName: any;
  developerName: string;
  setDeveloperName: any;
  serviceShortName: string;
  setServiceShortName: any;
  description: string;
  setDescription: any;
  startPurpose: string;
  setStartPurpose: any;
  dateStart: Date | null;
  endPurpose: string;
  setEndPurpose: any;
  dateEnd: Date | null;
  status: string;
  setStatus: any;
  isIS: boolean;
  setIsIs: any;
  isHasCoordinate: boolean;
  setIsHasCoordinate: any;
  isService: boolean;
  setIsService: any;
  criticalValue: number;
  setCriticalValue: any;
  onClose: any;
  setDateValue: any;
  setOutDateValue: any;
}) => {

  const humansAll = ['Мелихова Марина Вячеславовна','Петров Александр Аркадьевич', 'Гусев Алексей Сергеевич'];
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


  const rightsColumns = useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'name',
        type: 'string',
        minSize: 400,
        enableEditing: false,
      },
      {
        header: 'Доступ',
        accessorKey: 'access',
        type: 'string',
        minSize: 100,
        enableEditing: false,
      },
      {
        header: 'Описание',
        accessorKey: 'description',
        type: 'string',
        minSize: 200,
        enableEditing: false,
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

  const parent_data: string[] = ['','Печать и сканирование', 'Услуга технической поддержки пользователей','Услуга предоставления доступа к 1С: Зарплата и Кадры 7.7','Услуга предоставления доступа к 1С: Бухгалтерия 7.7','Услуга предоставления доступа к 1С: ГСМ 7.7','Услуга предоставления доступа к 1С: Документооборот 8.3','Услуга предоставления доступа к ПК "Реализация"','Услуга предоставления доступа к системам казначейства','Услуга предоставления доступа к системам канцелярии','Услуга предоставления доступа к системам ОРЭМ','Услуга технической поддержки прикладного ПО пользователей','1С:Предприятие','Услуга предоставления доступа к системам обмена информацией','Услуга организации печати и сканирования документов','Услуга доступа к этажной печати документов','Централизованные сервисы','Личный кабинет','ОРЭМ','АСУСЭ'];
  const status_data: string[] = ['АЭ', 'ПЭ', 'Разработка', 'ОПЭ', 'ОЭ', 'Выведена из эксплуатации']
  const type_data: string[] = ['ППО','ПО', 'АДМ', 'ИТ-услуга', 'Модуль'];
  const right_data: string[] = ['','Чтение', 'Чтение/Запись'];
  const [isRoleCreateDialogOpen, setIsRoleCreateDialogOpen] = useState(false);
  const [DepartmentName, setDepartmentName] = useState<string>("");
  const [RoleName, setRoleName] = useState<string>("");
  const [UserName, setUserName] = useState<string>("");
  const [isWorktypeCreateDialogOpen, setIsWorktypeCreateDialogOpen] = useState(false);
  const [isAccessRightCreateDialogOpen, setIsAccessRightDialogOpen] = useState(false);
  const [WorktypeDepartmentName, setWorktypeDepartmentName] = useState<string>("");
  const [WorktypeName, setWorktypeName] = useState<string>("");
  const [RightAccessName, setRightAccessName] = useState<string>("");
  const [RightAccessLevel, setRightAccessLevel] = useState<string>("");
  const [RightAccessDescription, setRightAccessDescription] = useState<string>("");
  const [GroupName, setGroupName] = useState<string>("");
  const [Note, setNote] = useState<string>("");
  const [isRoleDeleteDialogOpen, setIsRoleDeleteDialogOpen] = useState(false);
  const [RoleDeleteDialogTypeName, setRoleDeleteDialogTypeName] = useState<string | undefined>("");
  const [isWorktypeDeleteDialogOpen, setIsWorktypeDeleteDialogOpen] = useState(false);
  const [WorktypeDeleteDialogTypeName, setWorktypeDeleteDialogTypeName] = useState<string | undefined>("");
  const [isAccessRightDeleteDialogOpen, setIsAccessRightDeleteDialogOpen] = useState(false);
  const [AccessRightDeleteDialogTypeName, setAccessRightDeleteDialogTypeName] = useState<string | undefined>("");
  const [roleAlertOpen, setroleAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('1');

  const TableRoles = new tableClass(roles, rolesColumns);
  const TableWorkTypes = new tableClass(worktypes, worktypesColumns);
  const TableRights = new tableClass(rights, rightsColumns);
  const TableServicesAll = new tableClass(servicesAll, getColumns("Доступно"));
  const TableServicesChoose = new tableClass(servicesChoose, getColumns("Выбрано"));


  function createRole(mode: string, table: MRT_TableInstance<any>)
  {
    if (mode === "new")
    {
      setDepartmentName("");
      setRoleName("");
      setUserName("");
      setIsRoleCreateDialogOpen(true);
    }
    else if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      const department_name = table.getSelectedRowModel().rows[0]['original']['department'];
      const role_name = table.getSelectedRowModel().rows[0]['original']['role'];
      const user_name = table.getSelectedRowModel().rows[0]['original']['roleName'];
      // @ts-ignore
      setDepartmentName(department_name);
      // @ts-ignore
      setRoleName(role_name);
      // @ts-ignore
      setUserName(user_name);
      setIsRoleCreateDialogOpen(true);
    }
  }

  const onRoleCreateDialogClose = () => {
    setIsRoleCreateDialogOpen(false);
  }


  function createAccessRight(mode: string, table: MRT_TableInstance<any>)
  {
    if (mode === "new")
    {
      setRightAccessName("");
      setRightAccessLevel("");
      setRightAccessDescription("");
      setIsAccessRightDialogOpen(true);
    }
    else if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      const access_name = table.getSelectedRowModel().rows[0]['original']['name'];
      const access_level = table.getSelectedRowModel().rows[0]['original']['access'];
      const access_description = table.getSelectedRowModel().rows[0]['original']['description'];
      // @ts-ignore
      setRightAccessName(access_name);
      // @ts-ignore
      setRightAccessLevel(access_level);
      // @ts-ignore
      setRightAccessDescription(access_description);
      setIsAccessRightDialogOpen(true);
    }
  }

  function createWorktype(mode: string, table: MRT_TableInstance<any>)
  {
    if (mode === "new")
    {
      setWorktypeDepartmentName("");
      setWorktypeName("");
      setGroupName("");
      setNote("");
      setIsWorktypeCreateDialogOpen(true);
    }
    else if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      const department_name = table.getSelectedRowModel().rows[0]['original']['departmentName'];
      const worktype_name = table.getSelectedRowModel().rows[0]['original']['typeName'];
      const group_name = table.getSelectedRowModel().rows[0]['original']['groupName'];
      const note = table.getSelectedRowModel().rows[0]['original']['note'];
      // @ts-ignore
      setWorktypeDepartmentName(department_name);
      // @ts-ignore
      setWorktypeName(worktype_name);
      // @ts-ignore
      setGroupName(group_name);
      // @ts-ignore
      setNote(note);
      setIsWorktypeCreateDialogOpen(true);
    }
  }

  const onWorktypeCreateDialogClose = () => {
    setIsWorktypeCreateDialogOpen(false);
  }

  const onAccessRightCreateDialogClose = () => {
    setIsAccessRightDialogOpen(false);
  }

  const onRoleDeleteDialogClose = () => {
    setIsRoleDeleteDialogOpen(false);
  }

  const onWorktypeDeleteDialogClose = () => {
    setIsWorktypeDeleteDialogOpen(false);
  }

  const onAccessRightDeleteDialogClose = () => {
    setIsAccessRightDeleteDialogOpen(false);
  }

  function deleteWorktype(table: MRT_TableInstance<any>)
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      setWorktypeDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['typeName']+" ("+table.getSelectedRowModel().rows[0]['original']['note']+")");
      setIsWorktypeDeleteDialogOpen(true);
    }
  }

  function deleteAccessRight(table: MRT_TableInstance<any>)
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      setAccessRightDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['name']+" ("+table.getSelectedRowModel().rows[0]['original']['description']+")");
      setIsAccessRightDeleteDialogOpen(true);
    }
  }

  function deleteRole(table: MRT_TableInstance<any>)
  {
    if (table.getSelectedRowModel().rows.length === 0)
    {
      handleClick();
    }
    else
    {
      setRoleDeleteDialogTypeName(table.getSelectedRowModel().rows[0]['original']['role']+" ("+table.getSelectedRowModel().rows[0]['original']['roleName']+")");
      setIsRoleDeleteDialogOpen(true);
    }
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setValue("1");
    props.onClose();
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleRoleAlertClose = () => {
    setroleAlertOpen(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }

  const handleElemTransfer = (tableAdd: tableClass, TableDelete: tableClass) =>
    {
      if (TableDelete.getTableEntity().getSelectedRowModel().rows.length === 0)
      {
        handleClick();
      }
      else {
        // @ts-ignore
        const humanId = TableDelete.getTableEntity().getSelectedRowModel().rows[0]['original']['id'];
        const foundElement = TableDelete.getTableData().find(el => el.id === humanId);
        if (foundElement) {
          tableAdd.addElementsToTable([foundElement]);
          TableDelete.deleteElementFromTable(foundElement);
        }
      }
    }

  const handleTrasferAll = (tableAdd: tableClass, TableDelete: tableClass) => {
    tableAdd.addElementsToTable(TableDelete.getTableData());
    TableDelete.setTableData([]);
  };

  return (
    <div>
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleCloseAlert}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{width: '100%'}}
      >
        Вы не выбрали элемент из списка
      </Alert>
    </Snackbar>
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle sx={{paddingBottom: "0px"}}>Редактирование Сервиса (ИС)</DialogTitle>
      <DialogContent sx={{minHeight: '80vh', minWidth: '75vh'}}>
        <DialogContentText>

        </DialogContentText>
        <TabContext value={value}>
        <TabList onChange={handleChange} centered>
          <Tab label="ИТ-Услуга" value="1"/>
          <Tab label="Связанные услуги" value="2"/>
          <Tab label="Роли пользователей услуги" value="3"/>
          <Tab label="Работы по сервису" value="4"/>
          <Tab label="Права" value="5"/>
        </TabList>
          <TabPanel value="1" sx={{padding: "0px"}}>
            <ItservicesFirstTab
              parent={props.parent}
              serviceType={props.serviceType}
              serviceName={props.serviceName}
              description={props.description}
              startPurpose={props.startPurpose}
              dateStart={props.dateStart}
              endPurpose={props.endPurpose}
              dateEnd={props.dateEnd}
              status={props.status}
              serviceShortName={props.serviceShortName}
              isIS={props.isIS}
              isService={props.isService}
              isHasCoordinate={props.isHasCoordinate}
              type_data={type_data}
              parent_data={parent_data}
              status_data={status_data}
              criticalValue={props.criticalValue}
              setDateValue={props.setDateValue}
              setOutDateValue={props.setOutDateValue}
              setParent={props.setParent}
              setDescription={props.setDescription}
              setStartPurpose={props.setStartPurpose}
              setEndPurpose={props.setEndPurpose}
              setServiceName={props.setServiceName}
              setStatus={props.setStatus}
              setCriticalValue={props.setCriticalValue}
              setIsHasCoordinate={props.setIsHasCoordinate}
              setIsIs={props.setIsIs}
              setIsService={props.setIsService}
              setServiceShortName={props.setServiceShortName}
              setServiceType={props.setServiceType}
            />
          </TabPanel>
          <TabPanel value="2">
            <ItcatalogSecondTab
              TableServicesAll={TableServicesAll}
              TableServicesChoose={TableServicesChoose}
              handleTrasferAll={handleTrasferAll}
              handleElemTransfer={handleElemTransfer}
            />
          </TabPanel>
          <TabPanel value="3">
            <ItcatalogThirdTab
              TableMain={TableRoles}
              deleteFunction={deleteRole}
              createFunction={createRole}
            />
          </TabPanel>
          <TabPanel value="4">
            <ItcatalogThirdTab
              TableMain={TableWorkTypes}
              deleteFunction={deleteWorktype}
              createFunction={createWorktype}
            />
          </TabPanel>
          <TabPanel value="5">
            <ItcatalogThirdTab
              TableMain={TableRights}
              deleteFunction={deleteAccessRight}
              createFunction={createAccessRight}
            />
          </TabPanel>
        </TabContext>
        <Box>
          <Box position="absolute" bottom="15px" width="stretch">
            <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="center">
              <Grid2 size={3} >
                <Button
                  variant="contained"
                  color="primary"
                  size={'small'}
                  fullWidth={true}
                >
                  Сохранить
                </Button>
              </Grid2>
              <Grid2 size={3} offset={{md:3}}>
                <Button
                  variant="contained"
                  color="inherit"
                  size={'small'}
                  fullWidth={true}
                  onClick={handleClose}
                >
                  Отмена
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
      <Snackbar
        open={roleAlertOpen}
        autoHideDuration={5000}
        onClose={handleRoleAlertClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert
          onClose={handleRoleAlertClose}
          severity="error"
          variant="filled"
          sx={{width: '100%'}}
        >
          Вы не выбрали роль
        </Alert>
      </Snackbar>
      <DeleteDialog
        isOpen={isRoleDeleteDialogOpen}
        pageName="роль"
        typeName={RoleDeleteDialogTypeName}
        onClose={onRoleDeleteDialogClose}
      />
      <DeleteDialog
        isOpen={isWorktypeDeleteDialogOpen}
        pageName="тип работы"
        typeName={WorktypeDeleteDialogTypeName}
        onClose={onWorktypeDeleteDialogClose}
      />
      <DeleteDialog
        isOpen={isAccessRightDeleteDialogOpen}
        pageName="права доступа"
        typeName={AccessRightDeleteDialogTypeName}
        onClose={onAccessRightDeleteDialogClose}
      />
      <RoleCreateDialog
        isOpen={isRoleCreateDialogOpen}
        departmentName={DepartmentName}
        roleName={RoleName}
        userName={UserName}
        onClose={onRoleCreateDialogClose}
      />
      <ItcatalogWorktypeCreateDialog
        isOpen={isWorktypeCreateDialogOpen}
        departmentName={WorktypeDepartmentName}
        worktypeName={WorktypeName}
        groupName={GroupName}
        note={Note}
        onClose={onWorktypeCreateDialogClose}
      />
      <AccessRightCreateDialog
      isOpen={isAccessRightCreateDialogOpen}
      rightName={RightAccessName}
      rightAccessLevel={RightAccessLevel}
      rightAllAccess={right_data}
      rightDescription={RightAccessDescription}
      onClose={onAccessRightCreateDialogClose}
      />
    </div>
  );
}
