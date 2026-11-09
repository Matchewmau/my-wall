import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PostItem } from "./post-item";
import type { WallPost } from "@/lib/types";

export function PostFeed({
  posts,
  now,
  error,
  onRetry,
}: {
  posts: WallPost[];
  now: number;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <>
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Couldn't load posts</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Retry
            </Button>
          ) : null}
        </Alert>
      ) : null}
      {posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#65676b]">
          No posts yet. Be the first to share something.
        </p>
      ) : (
        <div className="divide-y divide-[#dddfe2]">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} now={now} />
          ))}
        </div>
      )}
    </>
  );
}
