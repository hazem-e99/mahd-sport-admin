import type { TableColumn } from "react-data-table-component";

export interface MyDataType {
  id?: number | string;
  _id?: number | string;
  [key: string]: string | number | boolean | undefined;
}

export interface SharedTableProps<T extends object = MyDataType> {
  columns: TableColumn<T>[];
  data: T[];
  handleRowClicked?: (row: T) => void;
  selectedRowId?: number | string | null;
  noDataTitle?: string;
  pending?: boolean;
  className?: string;
  direction?: "ltr" | "rtl";
  onSelectedRowsChange?: (selected: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: T[];
  }) => void;
  selectableRows?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

export interface TabConfig {
  id: string;
  name: string;
  nameLa: string;
  icon: string;
  visibility: number;
  visiblity: number;
  status: number;
}

export interface AllowedWidget {
  widgetId: number;
  pinAble: boolean;
  isLocked: boolean;
}

export interface TabFormInputs {
  id?: number;
  name: string;
  nameLa: string;
  icon: string;
  darkModeIcon: string;
  visibility: number | null;
  status: number;
  pinAble: boolean;
  allowedWidgets: AllowedWidget[];
  allowedRoleIds: number[];
}
export interface WidgetConfig {
  id: string;
  label: string;
  type: "Shortcut" | "Predefined";
  status: "Active" | "Not Active";
}


export type SortConfig = {
  key: keyof any;
  direction: "asc" | "desc";
} | null;
