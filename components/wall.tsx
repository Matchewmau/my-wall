"use client";

import { useEffect, useMemo, useState } from "react";
import { Composer } from "@/components/composer";
import { PostFeed } from "@/components/post-feed";
import { SetupNotice } from "@/components/setup-notice";
import {
  describeFeedError,
  mapPostRow,
  mergeLivePosts,
  mergeWallPosts,
  prependLivePost,
} from "@/lib/posts";
import { profile } from "@/lib/profile";
import type { PostRow, ShareInput, WallPost } from "@/lib/types";
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

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("wall-posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.new as PostRow;
          setLivePosts((previous) =>
            prependLivePost(previous, mapPostRow(row, profile.name)),
          );
        },
      )
      .subscribe((status, subscribeError) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Realtime subscription error", subscribeError);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
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

  async function handleShare({ body, photo }: ShareInput) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) throw new Error("Supabase isn't connected yet.");
    if (photo) throw new Error("Photo upload isn't connected yet.");

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({ body: body || null, photo_url: null, user_id: null })
      .select()
      .single();

    if (insertError) {
      throw new Error("Couldn't share your post. Please try again.");
    }

    const created = mapPostRow(data as PostRow, profile.name);
    setLivePosts((previous) => prependLivePost(previous, created));
  }

  return (
    <>
      {!isSupabaseConfigured ? <SetupNotice /> : null}
      <Composer disabled={!isSupabaseConfigured} onShare={handleShare} />
      <PostFeed
        posts={posts}
        now={now}
        error={error}
        onRetry={() => void retry()}
      />
    </>
  );
}
