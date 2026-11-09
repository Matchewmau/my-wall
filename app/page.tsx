import { ProfileCard } from "@/components/profile-card";
import { PostFeed } from "@/components/post-feed";
import { WallHeader } from "@/components/wall-header";
import { getStaticPosts } from "@/lib/static-posts";

export default function Home() {
  const now = Date.now();
  const staticPosts = getStaticPosts(now);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <WallHeader />
      <main className="mx-auto w-full max-w-[1100px] sm:mt-6 sm:px-4">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="border-b border-[#dddfe2] p-5 md:border-b-0 md:border-r">
              <ProfileCard />
            </aside>
            <section className="min-w-0 p-5 sm:p-6">
              <div className="mb-4 rounded-lg border border-dashed border-[#ccd0d5] bg-[#f7f8fa] p-4 text-sm text-[#65676b]">
                Composer arrives in a later task.
              </div>
              <PostFeed posts={staticPosts} now={now} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
