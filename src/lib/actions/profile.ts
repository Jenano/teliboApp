"use server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function ensureProfile() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        display_name:
          (user.user_metadata as any)?.name ??
          user.email?.split("@")[0] ??
          "User",
        avatar_url: null,
        locale: "cs",
        consent_terms: false,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
}
