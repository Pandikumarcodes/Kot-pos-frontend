import { type ReactNode } from "react";
import { table } from "./Token";

export function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={table.wrapper}>
      <table className="w-full">{children}</table>
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
