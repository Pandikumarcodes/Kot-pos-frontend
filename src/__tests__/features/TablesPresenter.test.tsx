import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TablesPresenter } from "../../features/waiter/tablesPage/TablesPresenter";
import type {
  FilterValue,
  Table,
} from "../../features/waiter/tablesPage/Tables.types";

vi.mock("../../components/ui/TableQrCode", () => ({
  TableQrCode: () => <button type="button">QR</button>,
}));

const tables: Table[] = [
  { _id: "available", tableNumber: 1, capacity: 2, status: "available" },
  { _id: "reserved", tableNumber: 2, capacity: 4, status: "reserved" },
  { _id: "occupied", tableNumber: 3, capacity: 4, status: "occupied" },
  { _id: "billing", tableNumber: 4, capacity: 6, status: "billing" },
];

function TablesHarness({ canAdd = true }: { canAdd?: boolean }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ tableNumber: "", capacity: "" });
  const filtered =
    filter === "all" ? tables : tables.filter((table) => table.status === filter);

  return (
    <TablesPresenter
      tables={tables}
      filtered={filtered}
      counts={{ available: 1, occupied: 1, billing: 1, reserved: 1 }}
      filter={filter}
      loading={false}
      isAdmin
      canAdd={canAdd}
      canDelete
      showAddModal={showAddModal}
      addForm={addForm}
      onOpenAddModal={() => setShowAddModal(true)}
      onCloseAddModal={() => setShowAddModal(false)}
      onAddFormChange={(field, value) =>
        setAddForm((current) => ({ ...current, [field]: value }))
      }
      onAddTable={(event) => event.preventDefault()}
      showAllocateModal={false}
      selectedTable={null}
      allocateForm={{ name: "", phone: "" }}
      onCloseAllocateModal={vi.fn()}
      onAllocateFormChange={vi.fn()}
      onAllocate={vi.fn()}
      onFilterChange={setFilter}
      onTableClick={vi.fn()}
      onDeleteTable={vi.fn()}
      onRefresh={vi.fn()}
    />
  );
}

describe("TablesPresenter", () => {
  it("renders available, reserved, occupied, and billing API statuses correctly", () => {
    render(<TablesHarness />);

    for (const status of ["Available", "Reserved", "Occupied", "Billing"]) {
      expect(screen.getAllByText(status).length).toBeGreaterThan(0);
    }

    fireEvent.click(screen.getByRole("button", { name: "occupied" }));
    expect(screen.getByText("T-3")).toBeInTheDocument();
    expect(screen.queryByText("T-1")).not.toBeInTheDocument();
  });

  it("opens an interactive add form and closes it with Cancel, close, backdrop, and Escape", () => {
    render(<TablesHarness />);
    const open = screen.getByRole("button", { name: "Add Table" });

    fireEvent.click(open);
    expect(screen.getByRole("dialog", { name: "Add New Table" })).toBeInTheDocument();
    const number = screen.getByRole("spinbutton", { name: "Table Number *" });
    const capacity = screen.getByRole("spinbutton", { name: "Capacity *" });
    fireEvent.change(number, { target: { value: "8" } });
    fireEvent.change(capacity, { target: { value: "6" } });
    expect(number).toHaveValue(8);
    expect(capacity).toHaveValue(6);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(open);
    fireEvent.click(screen.getByRole("button", { name: "Close Add New Table" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(open);
    fireEvent.mouseDown(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(open);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not expose table registration without the existing add permission", () => {
    render(<TablesHarness canAdd={false} />);
    expect(screen.queryByRole("button", { name: "Add Table" })).not.toBeInTheDocument();
  });
});
