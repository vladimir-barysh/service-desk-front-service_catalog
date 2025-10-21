import React from 'react';
import {
  Grid2, IconButton,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import { MantineReactTable } from 'mantine-react-table';
// eslint-disable-next-line no-unused-vars
import { tableClass } from '../../table-as-list/tableClass';

export const ItcatalogSecondTab = (props: {
  TableServicesAll: tableClass;
  TableServicesChoose: tableClass;
  handleTrasferAll: any;
  handleElemTransfer: any;
}) => {


  return (
     <Grid2 container spacing={1} direction={'row'} alignItems="center" justifyContent="center">
       <Grid2 size={5.5} >
         <MantineReactTable
           table={props.TableServicesAll.getTableEntity()}
         />
       </Grid2>
       <Grid2 container size={1} spacing={1} rowSpacing={1} alignItems="center" justifyContent="center">
         <IconButton onClick={() => props.handleElemTransfer(props.TableServicesChoose, props.TableServicesAll)}>
           <KeyboardArrowRight fontSize="large"/>
         </IconButton>
         <IconButton onClick={() => props.handleTrasferAll(props.TableServicesChoose, props.TableServicesAll)}>
           <KeyboardDoubleArrowRight fontSize="large"/>
         </IconButton>
         <IconButton onClick={() => props.handleElemTransfer(props.TableServicesAll, props.TableServicesChoose)}>
           <KeyboardArrowLeft fontSize="large"/>
         </IconButton>
         <IconButton onClick={() => props.handleTrasferAll(props.TableServicesAll, props.TableServicesChoose)}>
           <KeyboardDoubleArrowLeft fontSize="large"/>
         </IconButton>
       </Grid2>
       <Grid2 size={5.5} >
         <MantineReactTable
           table={props.TableServicesChoose.getTableEntity()}
         />
       </Grid2>
     </Grid2>

  );
}
