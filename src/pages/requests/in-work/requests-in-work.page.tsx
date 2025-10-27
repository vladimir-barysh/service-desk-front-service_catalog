import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import SplitButton, { Test } from '../../../components/split-button/split-button.component';
import { RequestCreateDialog } from '../../../components';
import { RequestCreateZNODialog } from '../../../components/request-create-zno-dialog/request-create-zno-dialog';
import { RequestCreateZNDDialog } from '../../../components/request-create-znd-dialog/request-create-znd-dialog';

const rows = [
  {
    'id': '1',
    'requestNumber': '1',
    'dateCreated': new Date(),
    'dateRealization': new Date(),
    'dateEnd': new Date(),
    'status': 'В работе',
  }
];

export function RequestsInWorkPage() {
  const [requestType, setRequestType] = useState(0);
  const [isCreateDialogZNOOpen, setIsCreateDialogZNOOpen] = useState(false);
  const [isCreateDialogZNDOpen, setIsCreateDialogZNDOpen] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const onRequestTypeSelect = (selected: any) => {
    setRequestType(selected);
    if (selected === "Заявка на обслуживание") {
      createZNODialog();
    }
    else if (selected === "Заявка на доступ") {
      createZNDDialog();
    }
    else {
      setIsCreateDialogOpen(true);
    }
  }

  function createZNDDialog() {
    setIsCreateDialogZNDOpen(true);
  }

  function createZNODialog() {
    setIsCreateDialogZNOOpen(true);
  }

  const onCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setIsCreateDialogZNOOpen(false);
    setIsCreateDialogZNDOpen(false);
  }

  useEffect(() => {
    console.debug('111' + requestType);
  }, [requestType]);

  return (
   <div>
     <Test click={onRequestTypeSelect} req={requestType}></Test>
     <Box height={50}>
       <SplitButton
         buttonText={'Создать заявку'}
         menuItems={['Заявка на обслуживание', 'Заявка на доступ', 'Заявка на изменение', 'Инцидент']}
         startIcon={<Add />}
         size={'small'}
         onSelect={onRequestTypeSelect}
       />
     </Box>
     <RequestCreateDialog
       isOpen={isCreateDialogOpen}
       requestName={requestType.toString()}
       onClose={onCreateDialogClose}
     />
     <RequestCreateZNODialog
       isOpen={isCreateDialogZNOOpen}
       onClose={onCreateDialogClose}
     />
     <RequestCreateZNDDialog
       isOpen={isCreateDialogZNDOpen}
       onClose={onCreateDialogClose}
     />
     <DataGrid
       style={{ backgroundColor: 'white' }}
       localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
       columns={[
         {
           headerName: '№ заявки',
           field: 'requestNumber',
         },
         {
           headerName: 'Дата внесения',
           field: 'dateCreated',
           type: 'dateTime',
           width: 170,
         },
         {
           headerName: 'Желаемый срок',
           field: 'dateRealization',
           type: 'dateTime',
           width: 170,
         },
         {
           headerName: 'Дата завершения',
           field: 'dateEnd',
           type: 'dateTime',
           width: 170,
         },
         {
           headerName: 'Статус',
           field: 'status',
           type: 'string',
         },
      ]}
      rows={rows}
     />
   </div>
  );
}