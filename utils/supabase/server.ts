import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export function createClient(cookieStore: CookieStore): SupabaseClient {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component; the proxy refreshes sessions.
        }
      },
    },
  });
}
