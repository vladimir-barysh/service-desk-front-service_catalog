import { useState, useMemo } from 'react';
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
import { useApproveCandidate, useCreateApprove } from '../../hooks/useApprove';

type Order = components['schemas']['OrderResponseDTO'];
type Candidate = components['schemas']['ApproveCandidateResponseDTO'];

interface CreateApproveDialogProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

export const CreateApproveDialog = ({ open, order, onClose }: CreateApproveDialogProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

  const { data: candidates = []} = useApproveCandidate(
    order?.serviceId ?? 0,
    open && !!order?.serviceId
  );

  const { mutate: createApprove, isPending } = useCreateApprove();

  const columns = useMemo<MRT_ColumnDef<Candidate>[]>(
    () => [
      {
        accessorKey: 'fio1c',
        header: 'ФИО',
        size: 200,
        mantineFilterTextInputProps: { placeholder: 'Поиск по ФИО' },
      },
      {
        accessorKey: 'userRoleName',
        header: 'Роль',
        size: 150,
        mantineFilterTextInputProps: { placeholder: 'Поиск по роли' },
      },
      {
        accessorKey: 'podrName',
        header: 'Подразделение',
        size: 200,
        mantineFilterTextInputProps: { placeholder: 'Поиск по подразделению' },
      },
    ],
    []
  );

  const handleConfirm = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedUserIds = selectedRows.map(row => row.original.idUser);
    if (!order || !order.idOrder || selectedUserIds.length === 0) return;
    
    createApprove({ idOrder: order.idOrder, userIds: selectedUserIds }, { onSuccess: () => onClose()});
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
    state: { rowSelection, columnFilters},
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    mantineFilterTextInputProps: { size: 'xs' },
    mantineTableHeadCellProps: {
      style: { fontSize: '15px', fontWeight: 600, padding: '10px' },
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cогласующие для {order?.orderTypeName} №{order?.nomer}</DialogTitle>
      <DialogContent sx={{ pt: 1, padding: '20px' }}>
        <MantineReactTable table={table} />
      </DialogContent>
      <DialogActions sx={{ margin: '0px 15px 15px 0px', gap: 1 }}>
        <Button 
            variant="contained" 
            size="small" 
            onClick={handleConfirm}
            disabled={isPending || Object.keys(rowSelection).length === 0}
        >
          Создать
        </Button>
        <Button variant="contained" color="inherit" size="small" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};