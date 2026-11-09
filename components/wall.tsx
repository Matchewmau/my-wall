"use client";

import { useEffect, useMemo, useState } from "react";
import { PostFeed } from "@/components/post-feed";
import { SetupNotice } from "@/components/setup-notice";
import {
  describeFeedError,
  mapPostRow,
  mergeLivePosts,
  mergeWallPosts,
} from "@/lib/posts";
import { profile } from "@/lib/profile";
import type { PostRow, WallPost } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

type WallProps = {
  initialPosts: WallPost[];
  staticPosts: WallPost[];
  initialNow: number;
  initialError: string | null;
};

export function Wall({
  initialPosts,
  staticPosts,
  initialNow,
  initialError,
}: WallProps) {
  const [livePosts, setLivePosts] = useState(initialPosts);
  const [error, setError] = useState(initialError);
  const [now, setNow] = useState(initialNow);
  const posts = useMemo(
    () => mergeWallPosts(livePosts, staticPosts),
    [livePosts, staticPosts],
  );

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  async function retry() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { data, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (fetchError) {
      setError(describeFeedError(fetchError.code));
      return;
    }
    const fetched = ((data ?? []) as PostRow[]).map((row) =>
      mapPostRow(row, profile.name),
    );
    setLivePosts((previous) => mergeLivePosts(fetched, previous));
    setError(null);
  }

  return (
    <>
      {!isSupabaseConfigured ? <SetupNotice /> : null}
      <PostFeed
        posts={posts}
        now={now}
        error={error}
        onRetry={() => void retry()}
      />
    </>
  );
}
