import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 1) Exchange the verification code for a session (sets auth cookies)
  const { data, error } = await supabase.auth.exchangeCodeForSession(request.url);

  // 2) Touch profile activity (last_seen_at)
  try {
    const uid = data?.session?.user?.id;
    if (uid) {
      await supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("user_id", uid);
    }
  } catch (_) {}

  const url = new URL(error ? "/prihlaseni?mode=login" : "/my-books", request.url);
  return NextResponse.redirect(url);
}
