import React from 'react';
import { useState, useMemo } from 'react';
import {
  Dialog, DialogContent,
  DialogContentText, DialogTitle,
  Box, Button,
  Grid2, IconButton
} from '@mui/material';
import { 
    Input, 
    Textarea, 
    Text, 
    CloseButton, 
    Radio, 
    Group, 
    Select, 
    Checkbox
} from '@mantine/core';

import { Close } from '@mui/icons-material';

import { IconAt, IconPhone } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import { ChooseServiceCreateDialog } from '../itservice-choose';
import { ItSystem } from '../itservice-choose/makeData';
import { employees, tableDataClass, roles, rolesDataClass } from './makeData';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

export const RequestCreateZNDDialog = (props: {
    isOpen: boolean;
    onClose: any;
}) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [chosen, setChosen] = React.useState<ItSystem | null>(null);
    const [selected, setSelected] = useState<tableDataClass | null>(null);
    const [search, setSearch] = useState("");
    const shouldFilterOptions = !employees.some((item) => item.mainName?.toLowerCase() === search.toLowerCase().trim());
    const filteredEmployees = shouldFilterOptions ? employees.filter((item) =>
        item.mainName?.toLowerCase().includes(search.toLowerCase().trim())
      )
    : employees;
    const employeeOptions = employees.map((emp) => ({ value: emp.mainName || "", label: emp.mainName || ""}));
    const [checked, setChecked] = useState(false);

    //
    const [reqType, setReqType] = useState<string>('');
    const [accessType, setAccessType] = useState<string>('');
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const isFormValid = useMemo(() => {
        return (
            reqType !== '' &&
            chosen !== null &&
            selected !== null &&
            accessType !== '' &&
            Object.keys(rowSelection).length > 0
        );
    }, [reqType, chosen, selected, accessType, rowSelection]);

    const columns = React.useMemo<MRT_ColumnDef<rolesDataClass>[]>(() => [
    { 
        accessorKey: 'roleName', header: 'Роль', size: 100,minSize: 20, maxSize: 100,
        Cell: ({ row }) => (
            <Text>
            {row.original.roleName}
            </Text>
        ), 
    },
    { 
        accessorKey: 'roleDescription', header: 'Описание', size: 600,
        Cell: ({ row }) => (
            <Text style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            {row.original.roleDescription}
            </Text>
        ), 
    },], []);
    const data = React.useMemo(() => roles, []);

    function CreateDialog() {
        setIsCreateDialogOpen(true);
    }
    const onCreateDialogClose = () => {
        setIsCreateDialogOpen(false);
    }

    const handleClose = () => {
        setChecked(false);
        setReqType('');
        setAccessType('');
        setChosen(null);
        setSelected(null);
        setRowSelection({});
        props.onClose();
    };

    const handleSave = () => {
        if (!isFormValid) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const formData = {
            service: chosen,
            requestType: reqType,
            accessType: accessType,
            employee: selected,
            roles: Object.keys(rowSelection).map((rowId) => data.find((role) => String(role.id) === rowId)),
        };

        console.log('Данные для сохранения:', formData);
        
        handleClose();
    };

    const handleReqTypeChange = (value: string) => {
        setReqType(value);
    };
    const handleAccessTypeChange = (value: string) => {
        setAccessType(value);
    }

    const handleSelect = (value: string | null) => {
        if (!value) return;
        const found = employees.find((e) => e.mainName === value) || null;
        setSelected(found);
    };

    const table = useMantineReactTable<rolesDataClass>({
        columns,
        data,
        enableRowSelection: true,
        getRowId: (row) => String(row.id),
        onRowSelectionChange: setRowSelection,
        state: { rowSelection },
        localization: MRT_Localization_RU,
        enableTopToolbar: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableRowNumbers: false,
        enableSorting: false,
        enableSelectAll: false,
        enableExpanding: false,
        enableHiding: false,
        enableDensityToggle: false,
        enableBottomToolbar: false,
        positionToolbarAlertBanner: 'none',
        initialState: {
            expanded: true,
            density: 'xs'
        },
        mantineTableProps: { striped: true, highlightOnHover: true, style: {tableLayout: 'fixed'} },
        mantinePaperProps: { withBorder: true, shadow: 'xs' },
        mantineTableContainerProps: {
            style: {
            maxHeight: 150,
            overflowY: 'auto',
            },
        },
    });
    
  return (
    <div>
    <ChooseServiceCreateDialog
           isOpen={isCreateDialogOpen}
           onClose={onCreateDialogClose}
           onSelect={(s) =>{
            setChosen(s);
           }}
    />    
    <Dialog
      open={props.isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="lg"
    >
        <DialogContent sx={{minHeight: '70vh', minWidth: '75vh', padding:"20x"}}>
            
            <Grid2 container spacing={0} direction={'row'} alignItems="left" justifyContent="space-between">
                <Grid2 size='auto'>
                    <Box fontSize='25px' fontWeight='700'>
                        Регистрация ЗНД
                    </Box>
                </Grid2>
                <Grid2 size='auto'>
                    <IconButton onClick={handleClose}>
                        <Close/>
                    </IconButton>
                </Grid2>
            </Grid2>
            <Box fontSize='15px' fontWeight='500' sx={{color: 'error.main'}}>
                Пункты с * обязательны к заполнению
            </Box>
            <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="left" paddingTop='5px' paddingBottom="10px">
                <Grid2 size={2}>
                    <Text fw={600}>Вид заявки *:</Text>
                </Grid2>
                <Radio.Group 
                value={reqType}
                onChange={handleReqTypeChange}
                withAsterisk >
                    <Group>
                        <Radio fw={200}
                        label="Предоставить/изменить доступ"
                        value="Предоставить/изменить доступ" 
                        /> 

                        <Radio fw={200}
                        label="Закрыть доступ"
                        value="Закрыть доступ"
                        />
                    </Group>
                </Radio.Group>
            </Grid2>
            <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" paddingBottom="15px">
                <Grid2 size={3}>
                    <Button
                    variant="contained"
                    color="primary"
                    size={'small'}
                    fullWidth={true}
                    onClick={CreateDialog}
                    >
                    Выберите ИТ-сервис *
                    </Button>
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingBottom="10px">
                <Grid2 size={2}>
                    <Text fw={600}>Сервис/модуль</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input 
                           variant='filled' 
                           value={chosen?.name ?? ""}
                           readOnly
                           rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setChosen(null)}
                                style={{ display: chosen ? undefined : 'none' }}
                            />}
                           />
                    </Input.Wrapper>
                </Grid2>
            </Grid2>  
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left">
                <Grid2 size={2}>
                    <Text fw={600}>Услуга</Text>
                </Grid2>
                <Grid2 size={3}>
                    <Input.Wrapper>
                           <Input 
                           variant='filled'
                           value={chosen?.name ?? ""}
                           readOnly
                           rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setChosen(null)}
                                style={{ display: chosen ? undefined : 'none' }}
                            />}
                           />
                    </Input.Wrapper>
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="center">
                <Grid2 size={6}>
                    <Input.Wrapper label="Кому доступ *" size='md'>
                        <Select
                            data={employeeOptions}
                            maxDropdownHeight={200}
                            searchable={true}
                            clearable={false}
                            value={selected?.mainName || null}
                            onChange={handleSelect}
                            variant='filled'
                        />
                    </Input.Wrapper>
                </Grid2>
                <Grid2 size={6}>
                    <Input.Wrapper label="Email" size='md'>
                        <Input 
                        value={selected?.email || ""}
                        readOnly
                        rightSection={<IconAt size={16} />} 
                        variant='filled'/>
                    </Input.Wrapper>
                </Grid2>    
            </Grid2>

            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left">
                <Grid2 size={6}>
                    <Input.Wrapper label="Должность" size='md'>
                        <Input 
                        value={selected?.post || ""}
                        readOnly
                        variant='filled'/>
                    </Input.Wrapper>
                </Grid2>
                <Grid2 size={6}>
                    <Input.Wrapper label="Сотовый телефон" size='md'>
                        <Input 
                        value={selected?.mobilePhoneNumber || ""}
                        readOnly
                        rightSection={<IconPhone size={16} />} 
                        variant='filled'/>
                    </Input.Wrapper>
                </Grid2>    
            </Grid2>

            <Grid2 container spacing={2} direction={'row'} alignItems="center" justifyContent="left" paddingBottom="10px">
                <Grid2 size={6}>
                    <Input.Wrapper label="Подразделение" size='md'>
                        <Input 
                        value={selected?.subdivison || ""}
                        readOnly
                        variant='filled'/>
                    </Input.Wrapper>
                </Grid2>
                <Grid2 size={6}>
                    <Input.Wrapper label="Внутренний телефон" size='md'>
                        <Input 
                        value={selected?.internalPhoneNumber || ""}
                        readOnly
                        rightSection={<IconPhone size={16} />} 
                        variant='filled'/>
                    </Input.Wrapper>
                </Grid2>    
            </Grid2>
            
            <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="left" paddingBottom="10px">
                <Grid2 size={5} >
                    <Checkbox
                    fw={600}
                    size='md'
                    label="Требуется фиксированный срок доступа"
                    checked={checked}
                    onChange={(event) => setChecked(event.currentTarget.checked)}
                    />
                </Grid2>
                <Text fw={600}>с:</Text>
                <Grid2 size={2}>
                    <DateTimePicker
                    placeholder="ДД.MM.ГГ ЧЧ:ММ"
                    valueFormat="DD.MM.YYYY HH:mm"
                    withSeconds={false} 
                    onPointerEnterCapture={undefined} 
                    onPointerLeaveCapture={undefined}
                    clearable
                    locale='ru'
                    disabled={!checked}  
                    />
                </Grid2>
                <Text fw={600}>по:</Text>
                <Grid2 size={2}>
                    <DateTimePicker
                    placeholder="ДД.MM.ГГ ЧЧ:ММ"
                    valueFormat="DD.MM.YYYY HH:mm"
                    withSeconds={false} 
                    onPointerEnterCapture={undefined} 
                    onPointerLeaveCapture={undefined}
                    clearable
                    locale='ru'
                    disabled={!checked}  
                    />
                </Grid2>
            </Grid2>
            
            <Grid2 container spacing={3} direction={'row'} alignItems="center" justifyContent="left" paddingBottom="10px">
                <Grid2 size={2}>
                    <Text fw={600}>Уровень доступа *:</Text>
                </Grid2>
                <Radio.Group 
                value={accessType}
                onChange={handleAccessTypeChange}
                withAsterisk >
                    <Group >
                        <Radio fw={200} 
                        label="Запись"
                        value="Запись"
                        />

                        <Radio fw={200} 
                        label="Чтение"
                        value="Чтение"
                        />
                    </Group>
                </Radio.Group>
            </Grid2>                    

            <Grid2 container spacing={2} direction="row" alignItems="stretch" justifyContent="left" paddingBottom="5px">
                <Grid2 size={12}>
                    <MantineReactTable table={table} />
                </Grid2>
            </Grid2>                   
            
            <Input.Wrapper label="Комментарий" size='md' >
                <Textarea
                variant="filled"
                autosize
                minRows={2}
                maxRows={2}
                // value={value} 
                // onChange={(e) => setValue(e.currentTarget.value)}
                />
            </Input.Wrapper>

            <Grid2 container spacing={3} direction={'row'} alignItems="left" justifyContent="left" paddingTop="10px">
                <Grid2 size={3} >
                    <Button
                    variant="contained"
                    color="success"
                    size={'small'}
                    fullWidth={true}
                    disabled={!isFormValid}
                    >
                    Сохранить
                    </Button>
                </Grid2>
                <Grid2 size={3}>
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
        </DialogContent>
    </Dialog>
    
    </div>
  );
}
