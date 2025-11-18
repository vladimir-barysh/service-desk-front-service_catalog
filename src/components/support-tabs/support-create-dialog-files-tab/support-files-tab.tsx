import React from 'react';
import { useState } from 'react';
import { Button, Grid2, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Text } from '@mantine/core';
import { Delete } from '@mui/icons-material';
import {
  MantineReactTable, useMantineReactTable,
  type MRT_ColumnDef, type MRT_Row,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

import { fileDataClass, files } from './makeData';
import { Request } from '../../../pages/support/all-support/makeData';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface SupportGeneralFirstTabProps {
  request: Request | null;
}

export function SupportFilesTab({ request }: SupportGeneralFirstTabProps) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = React.useMemo<MRT_ColumnDef<fileDataClass>[]>(() => [
    {
      id: 'rowNumber',
      header: '№ п.п.',
      size: 56,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination ?? { pageIndex: 0, pageSize: data.length };
        const num = pageIndex * pageSize + row.index + 1;
        return <Text>{num}</Text>;
      },
    },
    {
      accessorKey: 'dateOfCreation', header: 'Дата создания', size: 100,minSize: 20, maxSize: 100,
      Cell: ({ row }) => (
          <Text> 
          {row.original.dateOfCreation}
          </Text>
      ),
    },
    { 
      accessorKey: 'fileName', header: 'Имя файла', size: 100,minSize: 20, maxSize: 100,
      Cell: ({ row }) => (
          <Text>
          {row.original.fileName}
          </Text>
      ), 
    },
    { 
      accessorKey: 'author', header: 'Автор', size: 100,minSize: 20, maxSize: 100,
      Cell: ({ row }) => (
          <Text>
          {row.original.author}
          </Text>
      ), 
    },], []);

  const data = React.useMemo(() => files, []);

  const handleRowDoubleClick = (row: MRT_Row<fileDataClass>) => {
    // Открыть файл при двойном клике по строке
  };

  const table = useMantineReactTable<fileDataClass>({
    columns,
    data,
    enableRowSelection: false,
    getRowId: (row) => String(row.id),
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
    mantineTableProps: { 
      striped: true, 
      highlightOnHover: true, 
      style: {tableLayout: 'fixed'} 
    },
    mantinePaperProps: { 
      withBorder: true, 
      shadow: 'xs' 
    },
    mantineTableContainerProps: {
      style: {
      maxHeight: 450,
      overflowY: 'auto',
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
          if (selectedRowId !== row.id) {
            setSelectedRowId(row.id);
          }
          else {
            setSelectedRowId(null);
          }
        },
      onDoubleClick: () => handleRowDoubleClick(row),
      sx: (theme) => ({
        cursor: 'pointer',
        '& td': {
          backgroundColor:
            row.id === selectedRowId ? `${theme.colors.blue[0]} !important` : undefined,
        },
        '&:hover td': {
          backgroundColor:
            row.id === selectedRowId ? `${theme.colors.blue[1]} !important` : undefined,
        },
      }),
    })
  });
  
  return (
    <div>
      <Grid2 container spacing={2} direction={'row'} alignItems="left" justifyContent="left" paddingTop="15px">
        <Grid2 size={2}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            disabled={request?.status === 'Закрыта'}
          >
            Добавить файл
            <VisuallyHiddenInput
              type="file"
              onChange={
                // Загрузить файл
                (event) => console.log(event.target.files)
              }
              multiple
            />
          </Button>
        </Grid2>
        <Grid2 size={2}>
          <Button
          component="label"
          role={undefined}
          variant="contained"
          color="error"
          tabIndex={-1}
          startIcon={<Delete />}
          disabled={request?.status === 'Закрыта' || !selectedRowId}
          onClick={() => {
            // Удалить выбранный файл
          }}
          >
            Удалить файл
          </Button>
        </Grid2>
      </Grid2>
      
      <Grid2 paddingTop="15px">
        <MantineReactTable table={table} />
      </Grid2>
    </div>
  );
}