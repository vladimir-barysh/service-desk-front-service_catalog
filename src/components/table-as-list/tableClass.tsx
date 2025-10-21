// eslint-disable-next-line no-unused-vars
import { type MRT_ColumnDef, MRT_TableInstance } from 'mantine-react-table';
// eslint-disable-next-line no-unused-vars
import { TableAsList } from './index';
import React from 'react';

export class tableClass
{
  private tableData: any[];
  private tableEntity: MRT_TableInstance<any>;
  setTableData: any;

  constructor(tableData: any[], columns: MRT_ColumnDef<any>[]) {
    [this.tableData, this.setTableData] = React.useState<any[]>(tableData);
    this.tableEntity = TableAsList({data: this.tableData, columns: columns});
  }

  addElementsToTable(foundElements: any[])
  {
    this.setTableData(this.tableData.concat(foundElements));
  }

  deleteElementFromTable(foundElement: any)
  {
    this.setTableData(this.tableData.filter(item => item != foundElement));
  }

  getTableData()
  {
    return this.tableData;
  }

  getTableEntity()
  {
    return this.tableEntity;
  }
}