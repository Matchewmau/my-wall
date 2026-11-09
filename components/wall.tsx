"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
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
import { photoExtension } from "@/lib/validation";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

async function uploadPhoto(
  supabase: SupabaseClient,
  photo: File,
): Promise<string> {
  const extension = photoExtension(photo.type);
  if (!extension) {
    throw new Error("Choose a JPEG, PNG, WebP, or GIF image.");
  }

  const path = `photos/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("wall-photos")
    .upload(path, photo, {
      contentType: photo.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Couldn't upload that photo. Please try again.");
  }

  return supabase.storage.from("wall-photos").getPublicUrl(path).data.publicUrl;
}

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

    const photoUrl = photo ? await uploadPhoto(supabase, photo) : null;

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({ body: body || null, photo_url: photoUrl, user_id: null })
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
