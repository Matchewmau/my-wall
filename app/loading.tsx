import { FeedSkeleton } from "@/components/feed-skeleton";
import { WallHeader } from "@/components/wall-header";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <WallHeader />
      <main className="mx-auto mt-6 max-w-[1100px] px-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <FeedSkeleton />
        </div>
      </main>
    </div>
  );
}
