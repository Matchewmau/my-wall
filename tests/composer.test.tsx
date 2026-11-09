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

  it("shows a preview and enables Share for a photo-only post", async () => {
    const user = userEvent.setup();
    render(<Composer disabled={false} onShare={vi.fn()} />);
    await user.upload(
      screen.getByLabelText("Photo file"),
      new File(["x"], "photo.jpg", { type: "image/jpeg" }),
    );
    expect(await screen.findByAltText("Selected photo preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeEnabled();
  });

  it("rejects an unsupported file and keeps the previous photo", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Composer disabled={false} onShare={vi.fn()} />);
    const input = screen.getByLabelText("Photo file");
    await user.upload(input, new File(["x"], "photo.jpg", { type: "image/jpeg" }));
    await screen.findByAltText("Selected photo preview");
    await user.upload(input, new File(["x"], "notes.txt", { type: "text/plain" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a JPEG, PNG, WebP, or GIF image.",
    );
    expect(screen.getByAltText("Selected photo preview")).toBeInTheDocument();
  });

  it("removes the selected photo", async () => {
    const user = userEvent.setup();
    render(<Composer disabled={false} onShare={vi.fn()} />);
    await user.upload(
      screen.getByLabelText("Photo file"),
      new File(["x"], "photo.png", { type: "image/png" }),
    );
    await screen.findByAltText("Selected photo preview");
    await user.click(screen.getByRole("button", { name: "Remove photo" }));
    expect(screen.queryByAltText("Selected photo preview")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
  });

  it("revokes the preview URL on unmount", async () => {
    const user = userEvent.setup();
    const revoke = vi.mocked(URL.revokeObjectURL);
    revoke.mockClear();
    const { unmount } = render(<Composer disabled={false} onShare={vi.fn()} />);
    await user.upload(
      screen.getByLabelText("Photo file"),
      new File(["x"], "photo.jpg", { type: "image/jpeg" }),
    );
    await screen.findByAltText("Selected photo preview");
    unmount();
    expect(revoke).toHaveBeenCalledWith("blob:preview");
  });
});
