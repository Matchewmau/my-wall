import { PostItem } from "./post-item";
import type { WallPost } from "@/lib/types";

export function PostFeed({ posts, now }: { posts: WallPost[]; now: number }) {
  if (posts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#65676b]">
        No posts yet. Be the first to share something.
      </p>
    );
  }

  return (
    <div className="divide-y divide-[#dddfe2]">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} now={now} />
      ))}
    </div>
  );
}
