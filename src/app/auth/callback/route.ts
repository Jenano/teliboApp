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

  const urlObj = new URL(request.url);
  const next = urlObj.searchParams.get("next");

  if (!error) {
    // If next indicates password reset flow, set a short-lived proof cookie and go there
    if (next === "/reset-hesla") {
      cookieStore.set({
        name: "reset-ok",
        value: "1",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 5, // 5 minutes
        sameSite: "lax",
      });
      return NextResponse.redirect(new URL("/reset-hesla", request.url));
    }

    // Default success path
    return NextResponse.redirect(new URL("/my-books", request.url));
  }

  // On error
  return NextResponse.redirect(new URL("/prihlaseni?mode=login", request.url));
}
