import type { ReactNode } from "react";

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  accessor?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
}

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}
