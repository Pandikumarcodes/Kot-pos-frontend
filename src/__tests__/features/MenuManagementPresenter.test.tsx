import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { MenuManagementPresenter } from "../../features/admin/menu/MenuManagementPresenter";
import type { CreateMenuPayload } from "../../services/admin/menu.api";

function MenuHarness() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CreateMenuPayload>({
    ItemName: "",
    price: 0,
    category: "starter",
    available: true,
  });

  return (
    <MenuManagementPresenter
      menuItems={[]}
      pagination={{
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      }}
      loading={false}
      error={null}
      selectedCategory="all"
      searchQuery=""
      showModal={showModal}
      editingItem={null}
      formData={formData}
      formErrors={{}}
      isAdmin
      onCategoryChange={vi.fn()}
      onSearchChange={vi.fn()}
      onPageChange={vi.fn()}
      onLimitChange={vi.fn()}
      onOpenModal={() => setShowModal(true)}
      onCloseModal={() => setShowModal(false)}
      onFieldChange={(field, value) =>
        setFormData((previous) => ({ ...previous, [field]: value }))
      }
      onSubmit={(event) => event.preventDefault()}
      onDelete={vi.fn()}
      onToggle={vi.fn()}
      onRetry={vi.fn()}
    />
  );
}

describe("MenuManagementPresenter add item modal", () => {
  it("keeps text and number fields focused while their controlled values rerender", () => {
    render(<MenuHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Add Item" }));

    expect(screen.getByRole("dialog", { name: "Add Menu Item" })).toBeInTheDocument();
    const itemName = screen.getByRole("textbox", { name: "Item Name *" });
    itemName.focus();
    for (const value of ["B", "Bu", "But", "Butt", "Butter"]) {
      fireEvent.change(itemName, { target: { value } });
      expect(itemName).toHaveFocus();
      expect(screen.getByRole("button", { name: "Close Add Menu Item" })).not.toHaveFocus();
    }

    const price = screen.getByRole("spinbutton", { name: "Price (₹) *" });
    price.focus();
    fireEvent.change(price, { target: { value: "25" } });
    expect(price).toHaveFocus();
  });

  it("still closes from the modal close button and Escape key", () => {
    render(<MenuHarness />);
    const openButton = screen.getByRole("button", { name: "Add Item" });
    fireEvent.click(openButton);
    fireEvent.click(screen.getByRole("button", { name: "Close Add Menu Item" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(openButton);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
