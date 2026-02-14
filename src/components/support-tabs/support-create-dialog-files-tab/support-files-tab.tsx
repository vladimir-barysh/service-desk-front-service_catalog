import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Button, Grid2, styled, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Text } from '@mantine/core';
import { Delete } from '@mui/icons-material';
import {
  MantineReactTable, useMantineReactTable,
  type MRT_ColumnDef, type MRT_Row,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

import { fileDataClass, 
  uploadedFiles, 
  addFileToMakeData, 
  getFilesByRequestId, 
  deleteFileFromMakeData,
  getAllFiles 
} from './makeData';
import { Order } from '../../../pages/support/makeData';

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
  request: Order | null;
}

export function SupportFilesTab({ request }: SupportGeneralFirstTabProps) {
  
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [loadedFiles, setLoadedFiles] = useState<fileDataClass[]>([]);

  useEffect(() => {
    if (request?.nomer) {
      const requestFiles = uploadedFiles.filter(
        file => file.idRequest === request.nomer);
      setLoadedFiles(requestFiles);
    }
    else {
      setLoadedFiles([]);
    }
  }, [request?.nomer]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const newFileData = {
          fileName: file.name,
          dateOfCreation: new Date().toISOString(),
          author: 'Текущий пользователь',
          idRequest: request?.nomer,
          fileSize: file.size,
          fileType: file.type
        };

        const savedFile = addFileToMakeData(newFileData);
        setLoadedFiles(prev => [...prev, savedFile]);
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    } finally {
      event.target.value = '';
    }
  };

  const handleDeleteFile = () => {
    if (!selectedRowId) {
    return;
  }
    const fileId = parseInt(selectedRowId);

    const success = deleteFileFromMakeData(fileId);
    
    if (success) {
      setLoadedFiles(prev => prev.filter(file => file.id !== fileId));
      setSelectedRowId(null); 
    }
  };
  
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
          {formatDateTime(row.original.dateOfCreation)}
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
    },
    {
      accessorKey: 'fileSize',
      header: 'Размер',
      size: 100,
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {formatFileSize(cell.getValue() as number)}
        </Typography>
      ),
    },
  
  ], []);

  const data = React.useMemo(() => uploadedFiles, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateTimeString: string | undefined): string => {
    if (!dateTimeString){
      return 'Ничего нет';
    }

    if (dateTimeString.match(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/)) {
      return dateTimeString;
    }
  
    const date = new Date(dateTimeString);
    
    if (isNaN(date.getTime())) {
      return 'Неверная дата';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const handleRowDoubleClick = (row: MRT_Row<fileDataClass>) => {
    // Открыть файл при двойном клике по строке
  };

  const table = useMantineReactTable<fileDataClass>({
    columns,
    data: loadedFiles,
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
      maxHeight: 400,
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
        <Grid2 size='auto'>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            disabled={request?.orderState?.name === 'Закрыта'}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Добавить файлы
            <VisuallyHiddenInput
              type="file"
              onChange={
                // Загрузить файл
                handleFileUpload
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
          disabled={request?.orderState?.name === 'Закрыта' || !selectedRowId}
          onClick={handleDeleteFile}
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