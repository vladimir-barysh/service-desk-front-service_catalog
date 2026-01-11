import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid2,
  Box,
  Input,
  FormHelperText,
  Tab,
  IconButton
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { humansAll, humansChoose, servicesAll, servicesChoose } from './makeData';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { tableClass } from '../table-as-list/tableClass';
import { dataClass } from '../table-as-list';

export const GroupCreateDialog = (props: {
  isOpen: boolean;
  groupName: string;
  groupDescription: string;
  onClose: any;
}) => {

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

  const [value, setValue] = React.useState('1');
  const [open, setOpen] = React.useState(false);

  const TableServicesAll = new tableClass(servicesAll, getColumns("Выбрано"));
  const TableServicesChoose = new tableClass(servicesChoose, getColumns("Доступно"));
  const TableHumansAll = new tableClass(humansAll, getColumns("Выбрано"));
  const TableHumansChoose = new tableClass(humansChoose, getColumns("Доступно"));


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
      <DialogTitle>Редактирование группы</DialogTitle>
      <DialogContent
      sx={{minHeight: '80vh', minWidth: '75vh'}}
      >
        <DialogContentText>

        </DialogContentText>
        <TabContext value={value}>
        <TabList onChange={handleChange} centered>
          <Tab label="Группы поддержки" value="1"/>
          <Tab label="Связанные типы работ" value="2"/>
          <Tab label="Пользователи группы" value="3"/>
        </TabList>
          <TabPanel value="1">
            <Input id="groupname" defaultValue={props.groupName} style={{ width: '100%' }}/>
            <FormHelperText id="groupname-text">Наименование</FormHelperText>
            <Input id="groupdescription" multiline={true} maxRows={8}  defaultValue={props.groupDescription} style={{ width: '100%' }}/>
            <FormHelperText id="groupdescription-text">Описание</FormHelperText>
          </TabPanel>
          <TabPanel value="2">
            <Grid2 container spacing={1} direction={'row'} alignItems="center" justifyContent="center">
              <Grid2 size={5} >
                <MantineReactTable
                  table={TableServicesAll.getTableEntity()}
                />
              </Grid2>
              <Grid2 container size={1} spacing={1} alignItems="center" justifyContent="center">
                <IconButton onClick={() => handleElemTransfer(TableServicesChoose, TableServicesAll)}>
                  <KeyboardArrowRight fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleTrasferAll(TableServicesChoose, TableServicesAll)}>
                  <KeyboardDoubleArrowRight fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleElemTransfer(TableServicesAll, TableServicesChoose)}>
                  <KeyboardArrowLeft fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleTrasferAll(TableServicesAll, TableServicesChoose)}>
                  <KeyboardDoubleArrowLeft fontSize="large"/>
                </IconButton>
              </Grid2>
              <Grid2 size={5} >
                <MantineReactTable
                  table={TableServicesChoose.getTableEntity()}
                />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value="3">
            <Grid2 container spacing={1} direction={'row'} alignItems="center" justifyContent="center">
              <Grid2 size={5} >
                <MantineReactTable
                  table={TableHumansAll.getTableEntity()}
                />
              </Grid2>
              <Grid2 container size={1} spacing={1} alignItems="center" justifyContent="center">
                <IconButton onClick={() => handleElemTransfer(TableHumansChoose, TableHumansAll)}>
                  <KeyboardArrowRight fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleTrasferAll(TableHumansChoose, TableHumansAll)}>
                  <KeyboardDoubleArrowRight fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleElemTransfer(TableHumansAll, TableHumansChoose)}>
                  <KeyboardArrowLeft fontSize="large"/>
                </IconButton>
                <IconButton onClick={() => handleTrasferAll(TableHumansAll, TableHumansChoose)}>
                  <KeyboardDoubleArrowLeft fontSize="large"/>
                </IconButton>
              </Grid2>
              <Grid2 size={5} >
                <MantineReactTable
                  table={TableHumansChoose.getTableEntity()}
                />
              </Grid2>
            </Grid2>
          </TabPanel>
        </TabContext>
        <Box>
        <Box position="absolute" bottom="35px" width="stretch">
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
    </div>
  );
}
