import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ListError } from "../../components/ui/ListError";

describe("ListError", () => {
  it("renders an error message and invokes retry", () => {
    const onRetry = vi.fn();
    render(<ListError onRetry={onRetry} message="Inventory could not load." />);

    expect(screen.getByText("Inventory could not load.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("disables retry while a retry is running", () => {
    render(<ListError onRetry={vi.fn()} retrying />);

    expect(screen.getByRole("button", { name: "Retrying..." })).toBeDisabled();
  });
});
