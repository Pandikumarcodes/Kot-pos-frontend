import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "../../components/ui/SearchInput";

function ControlledSearchInput() {
  const [value, setValue] = useState("");
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search menu items"
      />
    </form>
  );
}

describe("SearchInput", () => {
  it("shows the clear button only when the search has a value", () => {
    render(<ControlledSearchInput />);
    const input = screen.getByRole("textbox", { name: "Search menu items" });

    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: "coffee" } });
    expect(screen.getByRole("button", { name: "Clear search" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("clears the controlled value without submitting a surrounding form", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    function SearchForm() {
      const [value, setValue] = useState("coffee");
      return (
        <form onSubmit={onSubmit}>
          <SearchInput value={value} onChange={setValue} />
        </form>
      );
    }

    render(<SearchForm />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
