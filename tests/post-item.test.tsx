import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PostItem } from "@/components/post-item";
import type { WallPost } from "@/lib/types";

const post: WallPost = {
  id: "post-1",
  author: "John Mathew B. Mauricio",
  body: "Application Test",
  created_at: "2026-11-09T12:00:00.000Z",
  photo_url: "https://example.com/test-photo.jpg",
};

const now = Date.parse("2026-11-09T12:00:00.000Z");
const triggerName = "View full size photo shared by John Mathew B. Mauricio";

function renderPost() {
  return render(<PostItem post={post} now={now} />);
}

describe("PostItem photo viewer", () => {
  it("opens a fullscreen dialog when the photo is clicked", async () => {
    const user = userEvent.setup();
    renderPost();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: triggerName }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("img", {
        name: "Photo shared by John Mathew B. Mauricio",
      }),
    ).toBeVisible();
  });

  it("closes the fullscreen dialog with Escape and returns focus to the photo", async () => {
    const user = userEvent.setup();
    renderPost();
    const trigger = screen.getByRole("button", { name: triggerName });

    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("closes the fullscreen dialog with the close button", async () => {
    const user = userEvent.setup();
    renderPost();

    await user.click(screen.getByRole("button", { name: triggerName }));
    await screen.findByRole("dialog");
    await user.click(
      screen.getByRole("button", { name: "Close fullscreen photo" }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
});
