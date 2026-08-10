import { type ReactNode } from "react";
import { table } from "./Token";

interface TableWrapperProps {
  children: ReactNode;
  scrollLabel: string;
  tableClassName?: string;
}

export function TableWrapper({
  children,
  scrollLabel,
  tableClassName,
}: TableWrapperProps) {
  return (
    <div
      aria-label={scrollLabel}
      className={table.wrapper}
      role="region"
      tabIndex={0}
    >
      <table className={`w-full ${tableClassName ?? ""}`}>{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead className={table.thead}>{children}</thead>;
}

export function Th({
  children,
  right,
}: {
  children?: ReactNode;
  right?: boolean;
}) {
  return <th className={right ? table.thRight : table.th}>{children}</th>;
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className={table.tbody}>{children}</tbody>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className={table.tr}>{children}</tr>;
}

export function Td({
  children,
  right,
}: {
  children?: ReactNode;
  right?: boolean;
}) {
  return <td className={right ? table.tdRight : table.td}>{children}</td>;
}
