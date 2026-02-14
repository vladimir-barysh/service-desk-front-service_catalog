/* eslint-disable no-undef, react/prop-types */
import React, { useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
} from '@mui/material';

import { type Service } from '../../api/models';

import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services/ServiceService';

export type ChooseServiceCreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (s: Service | null) => void;
};

export const ChooseServiceCreateDialog: React.FC<
  ChooseServiceCreateDialogProps
> = ({ isOpen, onClose, onSelect }) => {

  const {
    data: services = [],
    isLoading: serviceLoad,
    error: serviceError,
  } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: Infinity,
  });

  const filteredData = React.useMemo(
    () => services.filter((s: Service) => s.serviceState?.name !== 'Выведена из эксплуатации' && s.isService),
    [services],
  );

  const columns = React.useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'fullname',
        minSize: 240,
        size: 320,
        maxSize: 600,
        mantineFilterTextInputProps: {
          placeholder: 'Поиск',
        },
      },
    ],
    [],
  );

  const [rowSelection, setRowSelection] = React.useState<MRT_RowSelectionState>(
    {},
  );
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const handleFiltersChange = (updater: any) => {
    setColumnFilters(updater);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSelect?.(selected);
    onClose();
  };

  const handleClose = () => {
    onSelect?.(null);
    onClose();
  }

  const table = useMantineReactTable<Service>({
    columns: columns,
    data: filteredData,
    getRowId: (r) => r.idService?.toString(),
    localization: MRT_Localization_RU,

    mantineTableContainerProps: {
      style: {
        maxHeight: '400px', // или любая нужная высота
        overflowY: 'auto',
      },
    },

    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableSorting: true,
    enableRowNumbers: false,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    enableExpanding: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableBottomToolbar: false,
    filterFromLeafRows: true,
    positionToolbarAlertBanner: 'none',
    enableStickyHeader: true,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 100 },
      expanded: true,
      columnVisibility: { 'mrt-row-select': false },
      showColumnFilters: true,
    },

    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: (theme: any) => ({
        cursor: 'pointer',
      }),
    }),

    state: {
      rowSelection,
      columnFilters
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: handleFiltersChange,
    mantineFilterTextInputProps: {
      size: 'xs',
    },
    mantineTableHeadCellProps: {
      style: {
        fontSize: '15px',
        fontWeight: 600,
        padding: '10px 10px 10px 10px',
      },
    },
  });

  const selected = table.getSelectedRowModel().rows[0]?.original ?? null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: 700, maxWidth: '90vw', height: 550 } }}
    >
      <DialogTitle>Выберите ИТ-сервис.</DialogTitle>

      <DialogContent sx={{ pt: 1, padding: '20px' }}>
        <MantineReactTable table={table} />
      </DialogContent>

      <DialogActions
        sx={{
          margin: '0px 15px 15px 0px',
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          color="success"
          size="small"
          disabled={!selected}
          onClick={handleConfirm}
        >
          Выбрать
        </Button>
        <Button
          variant="contained"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
