import React, { useState } from 'react';
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
// eslint-disable-next-line no-unused-vars
import { MRT_TableInstance } from 'mantine-react-table';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// eslint-disable-next-line no-unused-vars
import { tableClass } from '../table-as-list/tableClass';
import { DeleteDialog } from '../delete-dialog';
import { RoleCreateDialog } from '../role-create-dialog';
import { ItcatalogFirstTab, ItcatalogSecondTab, ItcatalogThirdTab } from '../itcatalog-tabs';
import { Add } from '@mui/icons-material';
import { ItservicesCreateDialog } from '../itservices-create-dialog';


export const ItcatalogCreateDialog = (props: {
  isOpen: boolean;
  parent: string;
  setParent: any;
  serviceNumber: string;
  setServiceNumber: any;
  serviceName: string;
  setServiceName: any;
  description: string;
  setDescription: any;
  startPurpose: string;
  setStartPurpose: any;
  dateStart: Date | null;
  setDateValue: any;
  endPurpose: string;
  setEndPurpose: any;
  dateEnd: Date | null;
  setOutDateValue: any;
  status: string;
  setStatus: any;
  scale: string;
  setScale: any;
  influence: string;
  setInfluence: any;
  additionalInformation: string;
  setAdditionalInformation: any;
  onClose: any;
  tableRoles: tableClass;
  tableWorkTypes: tableClass;
  tableServicesAll: tableClass;
  tableServicesChoose: tableClass;
}) => {

  const status_data: string[] = ['АЭ', 'ПЭ', 'Разработка', 'ОПЭ', 'ОЭ', 'Выведена из эксплуатации']
  const scale_data: string[] = ['Корпоративный','Сегмент', 'Локальный'];
  const influence_data: string[] = ['Критичное','Среднее','Слабое']
  const [isRoleCreateDialogOpen, setIsRoleCreateDialogOpen] = useState(false);
  const [isItCatalogCreateDialogOpen, setIsItCatalogCreateDialogOpen] = useState(false);
  const [DepartmentName, setDepartmentName] = useState<string>("");
  const [RoleName, setRoleName] = useState<string>("");
  const [UserName, setUserName] = useState<string>("");
  const [isRoleDeleteDialogOpen, setIsRoleDeleteDialogOpen] = useState(false);
  const [RoleDeleteDialogTypeName, setRoleDeleteDialogTypeName] = useState<string | undefined>("");
  const [roleAlertOpen, setroleAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('1');
  const [parent, setParent] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [serviceShortName, setServiceShortName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startPurpose, setStartPurpose] = useState<string>("");
  const [developerName, setDeveloperName] = useState<string>("");
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [endPurpose, setEndPurpose] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isIS, setIsIS] = useState<boolean>(false);
  const [isHasCoordinate, setIsHasCoordinate] = useState<boolean>(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [criticalValue, setCriticalValue] = useState<number>(0);


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

  function createService()
  {
    setIsItCatalogCreateDialogOpen(true);
  }

  const onItCatalogCreateDialogClose = () => {
    setIsItCatalogCreateDialogOpen(false);
    setServiceType("");
    setIsIS(false);
    setServiceName("");
    setStatus("");
    setIsService(false);
    setDescription("");
    setServiceShortName("");
    setIsHasCoordinate(false);
    setCriticalValue(0);
    setDateEnd(null);
    setEndPurpose("");
    setStartPurpose("");
    setParent("");
    setDeveloperName("");
    setDateEnd(null);
  }

  const onRoleDeleteDialogClose = () => {
    setIsRoleDeleteDialogOpen(false);
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
      <DialogTitle sx={{paddingBottom: "0px"}}>Редактирование ИТ-услуги</DialogTitle>
      <DialogContent sx={{minHeight: '80vh', minWidth: '75vh'}}>
        <DialogContentText>

        </DialogContentText>
        <TabContext value={value}>
        <TabList onChange={handleChange} centered>
          <Tab label="ИТ-Услуга" value="1"/>
          <Tab label="Связанные сервисы" value="2"/>
          <Tab label="Роли пользователей услуги" value="3"/>
        </TabList>
          <TabPanel value="1" sx={{padding: "0px"}}>
            <ItcatalogFirstTab
              serviceNumber={props.serviceNumber}
              serviceName={props.serviceName}
              description={props.description}
              startPurpose={props.startPurpose}
              dateStart={props.dateStart}
              endPurpose={props.endPurpose}
              dateEnd={props.dateEnd}
              status={props.status}
              scale={props.scale}
              influence={props.influence}
              additionalInformation={props.additionalInformation}
              status_data={status_data}
              scale_data={scale_data}
              influence_data={influence_data}
              setDateValue={props.setDateValue}
              setOutDateValue={props.setOutDateValue}
              setServiceNumber={props.setServiceNumber}
              setInfluence={props.setInfluence}
              setScale={props.setScale}
              setAdditionalInformation={props.setAdditionalInformation}
              setDescription={props.setDescription}
              setStartPurpose={props.setStartPurpose}
              setEndPurpose={props.setEndPurpose}
              setServiceName={props.setServiceName}
              setStatus={props.setStatus}
            />
          </TabPanel>
          <TabPanel value="2">
            <Box height={50}>
              <Grid2 container>
                <Grid2 size={3} color={'primary'}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    size={'small'}
                    fullWidth={true}
                    onClick={createService}
                  >
                    Создать сервис
                  </Button>
                </Grid2>
              </Grid2>
            </Box>
            <ItcatalogSecondTab
              TableServicesAll={props.tableServicesAll}
              TableServicesChoose={props.tableServicesChoose}
              handleTrasferAll={handleTrasferAll}
              handleElemTransfer={handleElemTransfer}
            />
          </TabPanel>
          <TabPanel value="3">
            <ItcatalogThirdTab
              TableMain={props.tableRoles}
              deleteFunction={deleteRole}
              createFunction={createRole}
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
      <RoleCreateDialog
        isOpen={isRoleCreateDialogOpen}
        departmentName={DepartmentName}
        roleName={RoleName}
        userName={UserName}
        onClose={onRoleCreateDialogClose}
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
        onClose={onItCatalogCreateDialogClose}
      />
    </div>
  );
}
