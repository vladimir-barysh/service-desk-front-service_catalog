/* eslint-disable no-undef, react/prop-types */
import * as React from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
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

import {
  systems as allSystems,
  ItSystemStatus,
  type ItSystem,
  type Service,
} from './makeData';

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
  const data = React.useMemo(
    () => allSystems.filter((s) => s.status !== ItSystemStatus.Inactive),
    [],
  );

  const {
    data: services = [],
    isLoading: serviceLoad,
    error: serviceError,
  } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: Infinity,
  });

  const columns = React.useMemo<MRT_ColumnDef<Service>[]>(
    () => [
      {
        header: 'Наименование',
        accessorKey: 'fullname',
        minSize: 240,
        size: 320,
        maxSize: 600,
        /*{
      Cell: ({ row }) => (
        <span style={{ color: row.original.status === 'archived' ? '#6c757d' : undefined }}>
          {row.original.name}
        </span>
      ),*/
      },
    ],
    [],
  );

  const [rowSelection, setRowSelection] = React.useState<MRT_RowSelectionState>(
    {},
  );

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
    data: services,
    getRowId: (r) => r.idService?.toString(),
    localization: MRT_Localization_RU,

    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enableRowNumbers: false,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    enableExpanding: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableBottomToolbar: false,
    positionToolbarAlertBanner: 'none',

    initialState: {
      pagination: { pageIndex: 0, pageSize: 100 },
      expanded: true,
      columnVisibility: { status: false },
    },

    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: (theme: any) => ({
        cursor: 'pointer',
      }),
    }),

    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const selected = table.getSelectedRowModel().rows[0]?.original ?? null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: 720, maxWidth: '90vw', height: 520 } }}
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
