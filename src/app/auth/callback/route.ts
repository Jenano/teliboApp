import { NextResponse, NextRequest } from "next/server";
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

  console.log("[auth/callback] request.url =", request.url);
  const { data, error } = await supabase.auth.exchangeCodeForSession(request.url);
  if (error) {
    console.error("[auth/callback] exchange error:", { code: (error as any)?.code, message: error?.message });
  } else {
    console.log("[auth/callback] exchange OK; user =", data?.session?.user?.id);
  }

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
  console.log("[auth/callback] next =", next);

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
    return NextResponse.redirect(new URL("/app/moje-knihovna", request.url));
  }

  // On error (e.g., otp expired) redirect to reset tab with info message
  return NextResponse.redirect(
    new URL("/prihlaseni?mode=reset&msg=expired", request.url)
  );
}

export async function POST(req: NextRequest) {
  const { event, session } = await req.json();

  // Prepare response to write cookies into
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (event === "SIGNED_IN" && session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  return res;
}
