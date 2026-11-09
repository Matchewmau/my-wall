import { render, screen, waitFor } from "@testing-library/react";
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

  it("clears the composer after a successful share", async () => {
    const user = userEvent.setup();
    const onShare = vi.fn().mockResolvedValue(undefined);
    render(<Composer disabled={false} onShare={onShare} />);
    const textarea = screen.getByLabelText("Write a message");
    await user.type(textarea, "Hello wall");
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(onShare).toHaveBeenCalledWith({ body: "Hello wall", photo: null });
    await waitFor(() => expect(textarea).toHaveValue(""));
    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
  });

  it("keeps text and photo when sharing fails", async () => {
    const user = userEvent.setup();
    const onShare = vi
      .fn()
      .mockRejectedValue(new Error("Couldn't upload that photo. Please try again."));
    render(<Composer disabled={false} onShare={onShare} />);
    const textarea = screen.getByLabelText("Write a message");
    await user.type(textarea, "Hello wall");
    await user.upload(
      screen.getByLabelText("Photo file"),
      new File(["x"], "photo.jpg", { type: "image/jpeg" }),
    );
    await screen.findByAltText("Selected photo preview");
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Couldn't upload that photo. Please try again.",
    );
    expect(textarea).toHaveValue("Hello wall");
    expect(screen.getByAltText("Selected photo preview")).toBeInTheDocument();
  });

  it("does not submit twice while a share is pending", async () => {
    const user = userEvent.setup();
    let resolveShare!: () => void;
    const onShare = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveShare = resolve;
        }),
    );
    render(<Composer disabled={false} onShare={onShare} />);
    await user.type(screen.getByLabelText("Write a message"), "Hello");
    const share = screen.getByRole("button", { name: "Share" });
    await user.click(share);
    await user.click(share);
    expect(onShare).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Sharing/ })).toBeDisabled();
    resolveShare();
    await waitFor(() =>
      expect(screen.getByLabelText("Write a message")).toHaveValue(""),
    );
  });
});
