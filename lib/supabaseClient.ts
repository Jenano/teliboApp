"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _browserClient: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (!_browserClient) {
    _browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // Do not persist in localStorage; we'll mirror session to HttpOnly cookies via route handler.
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: true,
        },
      }
    );
  }
  return _browserClient;
}
