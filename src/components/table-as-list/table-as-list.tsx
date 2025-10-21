// eslint-disable-next-line no-unused-vars
import { MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { MRT_Localization_RU } from 'mantine-react-table/locales/ru';

export class dataClass {
  mainName: string | undefined;
}

export const TableAsList = (props: {
  data: any;
  columns: MRT_ColumnDef<any>[];
}) => {

  const table = useMantineReactTable({
    columns: props.columns,
    data: props.data,
    enableExpanding: false,
    enableTopToolbar:false,
    enableRowSelection:true,
    enableMultiRowSelection:false,
    enableSelectAll:false,
    enableHiding:false,
    enableColumnResizing:false,
    enablePagination:false,
    enableBottomToolbar:false,
    enableSorting: false,
    enableStickyHeader:true,
    enableColumnActions:false,
    enableEditing: true,
    editDisplayMode: 'table',
    localization:MRT_Localization_RU,
    initialState:{
      density: 'xs',
      showColumnFilters:true,
      columnVisibility: {'mrt-row-select': false},
    },
    mantineTableProps: {striped: true},
    mantineTableContainerProps:{ sx: { maxHeight: 550, minHeight: 550 } },

    mantineTableBodyCellProps:({row}) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: {
        cursor: 'pointer',
        border: '1px solid #dde7ee'
      }
    }),
  })
  return table;
}