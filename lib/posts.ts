import type { PostRow, WallPost } from "./types";

const byNewest = (a: WallPost, b: WallPost) =>
  Date.parse(b.created_at) - Date.parse(a.created_at);

export function mapPostRow(row: PostRow, author: string): WallPost {
  return {
    id: row.id,
    author,
    body: row.body,
    created_at: row.created_at,
    photo_url: row.photo_url,
  };
}

export function mergeLivePosts(
  first: WallPost[],
  second: WallPost[],
  limit = 50,
): WallPost[] {
  const byId = new Map<string, WallPost>();
  for (const post of [...first, ...second]) {
    if (!byId.has(post.id)) byId.set(post.id, post);
  }
  return [...byId.values()].sort(byNewest).slice(0, limit);
}

export function prependLivePost(
  posts: WallPost[],
  post: WallPost,
  limit = 50,
): WallPost[] {
  return mergeLivePosts([post], posts, limit);
}

export function mergeWallPosts(
  livePosts: WallPost[],
  staticPosts: WallPost[],
): WallPost[] {
  return mergeLivePosts(livePosts, staticPosts, livePosts.length + staticPosts.length);
}

export function describeFeedError(code?: string): string {
  if (code === "PGRST205") {
    return "Supabase is connected, but the posts table is missing. Run supabase/schema.sql, then retry.";
  }
  return "Couldn't load posts right now. Please try again.";
}
