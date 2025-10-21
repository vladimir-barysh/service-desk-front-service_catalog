import React from 'react';
import {
  Box, Button,
  Grid2
} from '@mui/material';
import {
  Add, Delete, Edit,
} from '@mui/icons-material';
import { MantineReactTable } from 'mantine-react-table';
// eslint-disable-next-line no-unused-vars
import { tableClass } from '../../table-as-list/tableClass';

export const ItcatalogThirdTab = (props: {
  TableMain: tableClass;
  deleteFunction: any;
  createFunction: any;
}) => {


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
               onClick={() => props.createFunction("new", props.TableMain.getTableEntity())}
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
               onClick={() => props.createFunction("edit", props.TableMain.getTableEntity())}
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
               onClick={()=>{props.deleteFunction(props.TableMain.getTableEntity())}}
             >
               Удалить
             </Button>
           </Grid2>
         </Grid2>
       </Box>
       <MantineReactTable
         table={props.TableMain.getTableEntity()}
       />
     </div>
  );
}
