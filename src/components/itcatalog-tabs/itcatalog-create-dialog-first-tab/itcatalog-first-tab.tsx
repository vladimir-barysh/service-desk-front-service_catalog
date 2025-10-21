import React from 'react';
import {
  Grid2,
} from '@mui/material';
import { Input, Select, Textarea } from '@mantine/core';
// eslint-disable-next-line no-unused-vars
import { DatePickerInput, DateValue } from '@mantine/dates';
import { CalendarMonth } from '@mui/icons-material';

export const ItcatalogFirstTab = (props: {
  serviceNumber: string;
  setServiceNumber: any;
  serviceName: string;
  setServiceName: any;
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
  scale: string;
  setScale: any;
  influence: string;
  setInfluence: any;
  additionalInformation: string;
  setAdditionalInformation: any;
  status_data: string[];
  scale_data: string[];
  influence_data: string[];
  setDateValue: any;
  setOutDateValue: any;
}) => {


  // @ts-ignore
  return (
   <div>
     <Input.Wrapper label="№ Услуги" >
       <Input size="xs" defaultValue={props.serviceNumber} onChange={e => props.setServiceNumber(e.target.value)}/>
     </Input.Wrapper>
     <Input.Wrapper label="Наименование" >
       <Input size="xs" defaultValue={props.serviceName} onChange={e => props.setServiceName(e.target.value)}/>
     </Input.Wrapper>
     <Input.Wrapper label="Описание" >
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
     <Grid2 container spacing={8} direction={'row'} paddingTop="10px">
       <Grid2 size={4}>
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
       <Grid2 size={4}>
         <Input.Wrapper label="Масштаб" withAsterisk>
           <Select
             size="xs"
             data={props.scale_data}
             defaultValue={props.scale}
             maxDropdownHeight={200}
             searchable={true}
             clearable={true}
             onChange={e => props.setScale(e)}
           />
         </Input.Wrapper>
       </Grid2>
       <Grid2 size={4}>
         <Input.Wrapper label="Влияние" withAsterisk>
           <Select
             size="xs"
             data={props.influence_data}
             defaultValue={props.influence}
             maxDropdownHeight={200}
             searchable={true}
             clearable={true}
             onChange={e => props.setInfluence(e)}
           />
         </Input.Wrapper>
       </Grid2>
     </Grid2>
     <Grid2 paddingTop="10px">
       <Input.Wrapper label="Дополнительная информация">
         <Input size="xs" defaultValue={props.additionalInformation} onChange={e => props.setAdditionalInformation(e.target.value)}/>
       </Input.Wrapper>
     </Grid2>

   </div>
  );
}
