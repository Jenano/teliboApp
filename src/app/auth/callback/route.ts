// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/app/moje-knihovna";

  // ✅ V app route handleru NEPOUŽÍVAT NextResponse.next()
  // Připravíme "prázdnou" odpověď, do které bude Supabase zapisovat cookies.
  const res = new NextResponse(null, { status: 200 });

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
          // vyprázdníme cookie (zachováme options, zejména path/samesite)
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const code = url.searchParams.get("code") ?? "";
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    // ❌ neplatný/expir. link → pošli na reset flow s hláškou
    const expired = new URL("/prihlaseni", url.origin);
    expired.searchParams.set("mode", "reset");
    expired.searchParams.set("msg", "expired");
    return NextResponse.redirect(expired, { headers: res.headers });
  }

  // ✅ úspěch → máme session v cookies (zapsalo se do `res`)
  if (next === "/reset-hesla") {
    // krátkodobý signál pro /reset-hesla, že link byl ověřen
    res.cookies.set({
      name: "reset-ok",
      value: "1",
      maxAge: 60 * 5,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  const target = new URL(next, url.origin);
  return NextResponse.redirect(target, { headers: res.headers });
}