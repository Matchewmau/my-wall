import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Composer } from "@/components/composer";

describe("Composer", () => {
  it("disables Share for empty or whitespace-only text", async () => {
    const user = userEvent.setup();
    render(<Composer disabled={false} onShare={vi.fn()} />);
    const share = screen.getByRole("button", { name: "Share" });
    expect(share).toBeDisabled();
    await user.type(screen.getByLabelText("Write a message"), "   ");
    expect(share).toBeDisabled();
    await user.type(screen.getByLabelText("Write a message"), "Hello");
    expect(share).toBeEnabled();
  });

  it("updates the remaining character count", async () => {
    const user = userEvent.setup();
    render(<Composer disabled={false} onShare={vi.fn()} />);
    expect(screen.getByText("280 characters remaining")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Write a message"), "Hi");
    expect(screen.getByText("278 characters remaining")).toBeInTheDocument();
  });

  it("disables the composer when Supabase is not configured", () => {
    render(<Composer disabled onShare={vi.fn()} />);
    expect(screen.getByLabelText("Write a message")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
  });
});
