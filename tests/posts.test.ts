import { describe, expect, it } from "vitest";
import {
  describeFeedError,
  mapPostRow,
  mergeLivePosts,
  mergeWallPosts,
  prependLivePost,
} from "@/lib/posts";
import type { PostRow, WallPost } from "@/lib/types";

const row: PostRow = {
  id: "live-1",
  user_id: null,
  body: null,
  created_at: "2026-11-09T10:00:00.000Z",
  photo_url: "https://example.com/photo.jpg",
};

const post = (id: string, createdAt: string): WallPost => ({
  id,
  author: "John Mathew B. Mauricio",
  body: `post ${id}`,
  created_at: createdAt,
  photo_url: null,
});

const staticPost = (id: string, createdAt: string): WallPost => ({
  ...post(id, createdAt),
  isStatic: true,
});

describe("post helpers", () => {
  it("maps a live row to a wall post, including photo-only posts", () => {
    expect(mapPostRow(row, "John Mathew B. Mauricio")).toEqual({
      id: "live-1",
      author: "John Mathew B. Mauricio",
      body: null,
      created_at: "2026-11-09T10:00:00.000Z",
      photo_url: "https://example.com/photo.jpg",
    });
  });

  it("sorts newest first, dedupes by id, and caps the live feed", () => {
    const older = post("a", "2026-11-09T09:00:00.000Z");
    const newer = post("b", "2026-11-09T11:00:00.000Z");
    expect(mergeLivePosts([older], [newer]).map((p) => p.id)).toEqual(["b", "a"]);
    expect(prependLivePost([older], older)).toHaveLength(1);
    const many = Array.from({ length: 51 }, (_, i) =>
      post(`p${i}`, new Date(Date.UTC(2026, 10, 9, 0, i)).toISOString()),
    );
    expect(
      prependLivePost(many, post("newest", "2026-11-09T12:00:00.000Z")),
    ).toHaveLength(50);
  });

  it("merges static posts into the timeline without trimming them", () => {
    const live = post("live", "2026-11-09T10:00:00.000Z");
    const statics = [
      staticPost("static-anna", "2026-11-09T08:00:00.000Z"),
      staticPost("static-sheryl", "2026-11-09T02:00:00.000Z"),
    ];
    expect(mergeWallPosts([live], statics).map((p) => p.id)).toEqual([
      "live",
      "static-anna",
      "static-sheryl",
    ]);
  });

  it("describes a missing posts table", () => {
    expect(describeFeedError("PGRST205")).toContain("supabase/schema.sql");
    expect(describeFeedError(undefined)).toBe(
      "Couldn't load posts right now. Please try again.",
    );
  });
});
