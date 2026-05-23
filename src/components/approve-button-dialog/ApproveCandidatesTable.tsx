import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
} from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';
import { components } from '../../types/api';

type Candidate = components['schemas']['ApproveCandidateResponseDTO'];

interface ApproveCandidatesTableProps {
  open: boolean;
  title: string;
  candidates: Candidate[];
  isLoading: boolean;
  initialSelection?: Record<string, boolean>;
  onConfirm: (selectedIds: number[]) => void;
  onCancel: () => void;
  confirmButtonText?: string;
  orderTypeName?: string;
  isPending?: boolean;
}

export const ApproveCandidatesTable = ({
  open,
  title,
  candidates,
  isLoading,
  initialSelection = {},
  onConfirm,
  onCancel,
  confirmButtonText = 'Сохранить',
  orderTypeName,
  isPending = false,
}: ApproveCandidatesTableProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>(initialSelection);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  // После загрузки данных, если пользователь ещё ничего не выбрал, применяем initialSelection
  useEffect(() => {
    if (!isLoading && Object.keys(rowSelection).length === 0 && Object.keys(initialSelection).length > 0) {
      setRowSelection(initialSelection);
    }
  }, [isLoading, initialSelection, rowSelection]);

  const columns = useMemo<MRT_ColumnDef<Candidate>[]>(() => {
    const baseColumns: MRT_ColumnDef<Candidate>[] = [
      {
        accessorKey: 'fio1c',
        header: 'ФИО',
        size: 200,
        mantineFilterTextInputProps: { placeholder: 'Поиск по ФИО' },
      },
      {
        accessorKey: 'podrName',
        header: 'Подразделение',
        size: 200,
        mantineFilterTextInputProps: { placeholder: 'Поиск по подразделению' },
      },
    ];

    if (orderTypeName === 'ЗНД') {
      baseColumns.splice(1, 0, {
        accessorKey: 'userRoleName',
        header: 'Роль',
        size: 150,
        mantineFilterTextInputProps: { placeholder: 'Поиск по роли' },
      });
    }
    return baseColumns;
  }, [orderTypeName]);

  const handleConfirm = () => {
    const selectedIds = Object.keys(rowSelection).map(Number);
    onConfirm(selectedIds);
  };

  const table = useMantineReactTable<Candidate>({
    columns,
    data: candidates,
    getRowId: (row) => String(row.idUser),
    localization: MRT_Localization_RU,
    enableTopToolbar: false,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableSorting: true,
    enableRowNumbers: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
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
      showColumnFilters: true,
    },
    mantineTableContainerProps: {
      style: { maxHeight: '400px', overflowY: 'auto' },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: 'pointer' },
    }),
    state: { rowSelection, columnFilters },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    mantineFilterTextInputProps: { size: 'xs' },
    mantineTableHeadCellProps: {
      style: { fontSize: '15px', fontWeight: 600, padding: '10px' },
    },
  });

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 1, padding: '20px' }}>
        {isLoading ? <div>Загрузка...</div> : <MantineReactTable table={table} />}
      </DialogContent>
      <DialogActions sx={{ margin: '0px 15px 15px 0px', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleConfirm}
          disabled={isPending || Object.keys(rowSelection).length === 0}
        >
          {confirmButtonText}
        </Button>
        <Button variant="contained" color="inherit" size="small" onClick={onCancel}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};