import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }
  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};
