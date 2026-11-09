import { cookies } from "next/headers";
import { ProfileCard } from "@/components/profile-card";
import { Wall } from "@/components/wall";
import { WallHeader } from "@/components/wall-header";
import { describeFeedError, mapPostRow } from "@/lib/posts";
import { profile } from "@/lib/profile";
import { getStaticPosts } from "@/lib/static-posts";
import type { PostRow, WallPost } from "@/lib/types";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  // force-dynamic: each request renders a fresh wall, so reading the clock here
  // is intentional even though the React purity rule cannot tell it apart from
  // a client render.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const staticPosts = getStaticPosts(now);
  let initialPosts: WallPost[] = [];
  let initialError: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) {
        initialError = describeFeedError(error.code);
      } else {
        initialPosts = ((data ?? []) as PostRow[]).map((row) =>
          mapPostRow(row, profile.name),
        );
      }
    } catch {
      initialError = describeFeedError();
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <a
        href="#wall-feed"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#3b5998] focus:shadow"
      >
        Skip to wall
      </a>
      <WallHeader />
      <main className="mx-auto w-full max-w-[1100px] sm:mt-6 sm:px-4">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="border-b border-[#dddfe2] p-5 md:border-b-0 md:border-r">
              <ProfileCard />
            </aside>
            <section className="min-w-0 p-5 sm:p-6">
              <Wall
                initialPosts={initialPosts}
                staticPosts={staticPosts}
                initialNow={now}
                initialError={initialError}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
