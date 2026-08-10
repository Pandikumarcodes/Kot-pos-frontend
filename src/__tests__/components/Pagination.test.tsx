import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../../components/ui/Pagination";
import type { PaginationMeta } from "../../types/query";

const meta = (page: number, pages = 5): PaginationMeta => ({
  page,
  limit: 20,
  total: 100,
  pages,
  hasPrev: page > 1,
  hasNext: page < pages,
});

describe("Pagination", () => {
  it("disables Previous on the first page and moves to the next page", () => {
    const onPageChange = vi.fn();
    render(<Pagination pagination={meta(1)} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent(
      "Page 1 of 5",
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("supports previous, next, and direct navigation from a middle page", () => {
    const onPageChange = vi.fn();
    render(<Pagination pagination={meta(3)} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Page 5" }));

    expect(onPageChange.mock.calls).toEqual([[2], [4], [5]]);
  });

  it("disables Next on the last page and can show the item range", () => {
    render(
      <Pagination pagination={meta(5)} onPageChange={vi.fn()} showSummary />,
    );

    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent(
      "Showing 81–100 of 100",
    );
  });
});
