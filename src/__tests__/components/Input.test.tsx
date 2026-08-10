import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../../components/ui/Input";

describe("Input", () => {
  it("keeps an end adornment inside the relative input wrapper", () => {
    render(
      <Input
        label="Password"
        type="password"
        endAdornment={<button type="button">Show password</button>}
      />,
    );

    const input = screen.getByLabelText("Password");
    const button = screen.getByRole("button", { name: "Show password" });
    const adornment = button.parentElement;
    const wrapper = adornment?.parentElement;

    expect(input).toHaveClass("pr-12");
    expect(wrapper).toHaveClass("relative");
    expect(adornment).toHaveClass(
      "absolute",
      "right-1",
      "top-1/2",
      "-translate-y-1/2",
    );
    expect(wrapper).toContainElement(input);
    expect(wrapper).toContainElement(button);
  });
});
