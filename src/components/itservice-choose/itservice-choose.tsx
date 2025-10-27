/* eslint-disable no-undef, react/prop-types */
import * as React from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import { systems as allSystems, ItSystemStatus, type ItSystem } from './makeData';

export type ChooseServiceCreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (s: ItSystem | null) => void;
};

export const ChooseServiceCreateDialog: React.FC<ChooseServiceCreateDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const data = React.useMemo(
    () => allSystems.filter((s) => s.status !== ItSystemStatus.Inactive),
    []
  );

  const columns = React.useMemo<MRT_ColumnDef<ItSystem>[]>(() => [
    {
      header: 'Наименование',
      accessorKey: 'name',
      minSize: 240,
      size: 320,
      maxSize: 600,
      Cell: ({ row }) => (
        <span style={{ color: row.original.status === 'archived' ? '#6c757d' : undefined }}>
          {row.original.name}
        </span>
      ),
    },
    { header: 'Статус', accessorKey: 'status', enableHiding: false },
  ], []);

  const [rowSelection, setRowSelection] = React.useState<MRT_RowSelectionState>({});
  const selectedId = React.useMemo(() => Object.keys(rowSelection)[0] ?? null, [rowSelection]);
  const selected = React.useMemo(
    () => (selectedId ? data.find((d) => d.id === selectedId) ?? null : null),
    [selectedId, data]
  );

  const handleConfirm = () => {
    if (!selected) return;
    onSelect?.(selected);
    onClose();
  }

  const table = useMantineReactTable<ItSystem>({
    columns,
    data,
    getRowId: (r) => r.id,
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
        backgroundColor: row.getIsSelected()
          ? theme.colors?.blue?.[1] ?? 'rgba(25,118,210,0.12)'
          : row.original.status === 'archived'
            ? theme.colors?.gray?.[1] ?? '#f1f3f5'
            : undefined,
        '&:hover': {
          backgroundColor: row.original.status === 'archived'
            ? theme.colors?.gray?.[2] ?? '#e9ecef'
            : theme.colors?.gray?.[0] ?? '#f8f9fa',
      }}),
    }),

    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: 720, maxWidth: '90vw', height: 520 } }}
    >
      <DialogTitle>Выберите ИТ-сервис, к которому необходим доступ.</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <MantineReactTable table={table} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          disabled={!selected}
          onClick={handleConfirm}
        >
          Выбрать
        </Button>
        <Button color="inherit" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};
