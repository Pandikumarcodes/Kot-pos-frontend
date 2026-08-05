import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import type { TableColumn } from "./sharedTypes";

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey?: (row: T, index: number) => string | number;
  emptyState?: ReactNode;
  caption?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey = (_, index) => index,
  emptyState,
  caption,
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-kot-chart bg-kot-white shadow-kot ${className}`}
    >
      <table className="min-w-full text-left" aria-label={caption}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b border-kot-chart bg-kot-light">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-kot-text ${column.headerClassName ?? ""} ${column.hideOnMobile ? "hidden sm:table-cell" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-kot-chart">
          {data.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="transition-colors hover:bg-kot-primary"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm text-kot-darker ${column.className ?? ""} ${column.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                >
                  {column.render
                    ? column.render(row, index)
                    : column.accessor
                      ? String(row[column.accessor] ?? "")
                      : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 &&
        (emptyState ?? <EmptyState title="No results found" />)}
    </div>
  );
}
