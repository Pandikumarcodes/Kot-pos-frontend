import type { Table, TableStatus } from "../../../services/waiterApi/Table.api";

export type { Table, TableStatus };

export type FilterValue =
  | "all"
  | "available"
  | "occupied"
  | "billing"
  | "reserved";

export interface TableCounts {
  available: number;
  occupied: number;
  billing: number;
  reserved: number;
}

export interface TablesPresenterProps {
  tables: Table[];
  filtered: Table[];
  counts: TableCounts;
  filter: FilterValue;
  loading: boolean;
  isAdmin: boolean;
  canDelete: boolean;

  // add modal
  showAddModal: boolean;
  addForm: { tableNumber: string; capacity: string };
  onOpenAddModal: () => void;
  onCloseAddModal: () => void;
  onAddFormChange: (field: "tableNumber" | "capacity", value: string) => void;
  onAddTable: (e: React.FormEvent) => void;

  // allocate modal
  showAllocateModal: boolean;
  selectedTable: Table | null;
  allocateForm: { name: string; phone: string };
  onCloseAllocateModal: () => void;
  onAllocateFormChange: (field: "name" | "phone", value: string) => void;
  onAllocate: (e: React.FormEvent) => void;

  onFilterChange: (f: FilterValue) => void;
  onTableClick: (table: Table) => void;
  onDeleteTable: (table: Table, e: React.MouseEvent) => void;
  onRefresh: () => void;
}
