import React from 'react';
import {
  Grid2,
} from '@mui/material';
import { Checkbox, Input, Select, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CalendarMonth } from '@mui/icons-material';

export const ItservicesFirstTab = (props: {
  parent: string;
  setParent: any;
  serviceType: string;
  setServiceType: any;
  serviceName: string;
  setServiceName: any;
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
  type_data: string[];
  parent_data: string[];
  status_data: string[];
  setDateValue: any;
  setOutDateValue: any;
}) => {


  return (
   <div>
     <Input.Wrapper label="Тип сервиса" withAsterisk>
       <Select
         size="xs"
         data={props.type_data}
         defaultValue={props.serviceType}
         maxDropdownHeight={200}
         searchable={true}
         clearable={false}
         onChange={e => props.setServiceType(e)}
       />
     </Input.Wrapper>
     <Input.Wrapper label="Краткое наименование" withAsterisk>
       <Input size="xs" defaultValue={props.serviceName} onChange={e => props.setServiceName(e.target.value)}/>
     </Input.Wrapper>
     <Input.Wrapper label="Полное наименование" withAsterisk>
       <Input size="xs" defaultValue={props.serviceShortName} onChange={e => props.setServiceShortName(e.target.value)}/>
     </Input.Wrapper>
     <Input.Wrapper label="Родитель" >
       <Select
         size="xs"
         data={props.parent_data}
         defaultValue={props.parent}
         maxDropdownHeight={200}
         searchable={true}
         clearable={false}
         onChange={e => props.setParent(e)}
       />
     </Input.Wrapper>
     <Input.Wrapper label="Описание">
       <Textarea size="xs" defaultValue={props.description} minRows={4} maxRows={4} onChange={e => props.setDescription(e.target.value)}/>
     </Input.Wrapper>
     <Grid2 container spacing={2} direction={'row'} paddingTop="10px">
       <Grid2 size={6}>
         <Input.Wrapper label="Основание для ввода в эксплуатацию" >
           <Input size="xs" defaultValue={props.startPurpose} onChange={e => props.setStartPurpose(e.target.value)}/>
         </Input.Wrapper>
       </Grid2>
       <Grid2 size={6}>
         <Input.Wrapper label="Дата ввода в эксплуатацию" >
           <DatePickerInput
             clearable={true}
             valueFormat="DD.MM.YYYY"
             onChange={e => props.setDateValue(e)}
             defaultValue={props.dateStart}
             locale="ru"
             size="xs"
             rightSection={<CalendarMonth />}
           />
         </Input.Wrapper>
       </Grid2>
     </Grid2>
     <Grid2 container spacing={2} direction={'row'} paddingTop="10px">
       <Grid2 size={6}>
         <Input.Wrapper label="Основание для вывода из эксплуатации" >
           <Input size="xs" defaultValue={props.endPurpose} onChange={e => props.setEndPurpose(e.target.value)}/>
         </Input.Wrapper>
       </Grid2>
       <Grid2 size={6}>
         <Input.Wrapper label="Дата вывода из эксплуатации">
           <DatePickerInput
             clearable={true}
             valueFormat="DD.MM.YYYY"
             onChange={e => props.setOutDateValue(e)}
             defaultValue={props.dateEnd}
             locale="ru"
             size="xs"
             rightSection={<CalendarMonth />}
           />
         </Input.Wrapper>
       </Grid2>
     </Grid2>
     <Grid2 container spacing={2} direction={'row'} paddingTop="10px">
       <Grid2 size={6}>
         <Input.Wrapper label="Статус" withAsterisk>
           <Select
             size="xs"
             data={props.status_data}
             defaultValue={props.status}
             maxDropdownHeight={200}
             searchable={true}
             clearable={true}
             onChange={e => props.setStatus(e)}
           />
         </Input.Wrapper>
       </Grid2>
       <Grid2 size={6}>
         <Input.Wrapper label="Критичность для бизнеса" withAsterisk>
           <Input size="xs" defaultValue={props.criticalValue}  onChange={e => props.setCriticalValue(e.target.value)}/>
         </Input.Wrapper>
       </Grid2>
     </Grid2>
     <Grid2 container spacing={2} direction={'row'} paddingTop="10px">
       <Grid2 size={4}>
         <Input.Wrapper sx={{paddingTop:"10px"}}>
           <Checkbox checked={props.isIS} onChange={() => props.setIsIs(!props.isIS)} label="Является ИС" sx={{ ["& .mantine-Checkbox-label"]: { color: "#212529" } }}/>
         </Input.Wrapper>
         </Grid2>
       <Grid2 size={4}>
         <Input.Wrapper sx={{paddingTop:"10px"}}>
           <Checkbox checked={props.isHasCoordinate}  onChange={() => props.setIsHasCoordinate(!props.isHasCoordinate)} label="Требует согласования" sx={{ ["& .mantine-Checkbox-label"]: { color: "#212529" } }}/>
         </Input.Wrapper>
       </Grid2>
       <Grid2 size={4}>
         <Input.Wrapper sx={{paddingTop:"10px", paddingBottom:"10px"}}>
           <Checkbox checked={props.isService} onChange={() => props.setIsService(!props.isService)} label="Является сервисом" sx={{ ["& .mantine-Checkbox-label"]: { color: "#212529" } }}/>
         </Input.Wrapper>
       </Grid2>
     </Grid2>
   </div>
  );
}
