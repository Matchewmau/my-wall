import { ImageLightbox } from "@/components/image-lightbox";
import type { WallPost } from "@/lib/types";
import { timeAgo } from "@/lib/time";

export function PostItem({ post, now }: { post: WallPost; now: number }) {
  return (
    <article className={`py-4 ${post.isStatic ? "" : "post-enter"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold text-[#3b5998]">{post.author}</p>
        <time
          dateTime={post.created_at}
          suppressHydrationWarning
          className="shrink-0 text-xs text-[#65676b]"
        >
          {timeAgo(post.created_at, now)}
        </time>
      </div>
      {post.body ? (
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#1c1e21]">
          {post.body}
        </p>
      ) : null}
      {post.photo_url ? (
        <ImageLightbox
          src={post.photo_url}
          alt={`Photo shared by ${post.author}`}
          triggerLabel={`View full size photo shared by ${post.author}`}
        />
      ) : null}
    </article>
  );
}
