import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../../components/ui/Pagination";
import { SearchBar } from "../../components/ui/SearchBar";
import { getBillingOrderOptions } from "../../features/cashier/billing/BillingPresenter";

describe("cashier billing UI", () => {
  it.each([
    [{ page: 1, pageSize: 20, total: 1 }, true, true],
    [{ page: 1, pageSize: 20, total: 40 }, true, false],
    [{ page: 2, pageSize: 20, total: 40 }, false, true],
  ])("disables pagination controls at the correct boundary", (state, previousDisabled, nextDisabled) => {
    render(<Pagination state={state} onPageChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toHaveProperty("disabled", previousDisabled);
    expect(screen.getByRole("button", { name: "Next page" })).toHaveProperty("disabled", nextDisabled);
  });

  it("reserves space for the search icon and clear control while preserving search behavior", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Search" });
    const searchIcon = container.querySelector("svg.lucide-search");

    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveAttribute("aria-hidden", "true");
    expect(searchIcon).toHaveClass("pointer-events-none");
    expect(input).toHaveStyle({ paddingInlineStart: "2.5rem", paddingInlineEnd: "2.75rem" });
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "coffee" } });
    expect(onChange).toHaveBeenCalledWith("coffee");

    rerender(<SearchBar value="coffee" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("uses date-specific labels for date sorting and neutral labels otherwise", () => {
    expect(getBillingOrderOptions("billDate")).toEqual([
      { value: "desc", label: "Newest first" },
      { value: "asc", label: "Oldest first" },
    ]);
    expect(getBillingOrderOptions("paymentStatus")).toEqual([
      { value: "desc", label: "Descending" },
      { value: "asc", label: "Ascending" },
    ]);
  });
});
