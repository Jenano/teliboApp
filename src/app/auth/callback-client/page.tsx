"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AuthCallbackClient() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const supabase = supabaseBrowser();

        // Debug: log the full URL that arrived (query or hash tokens)
        const href = window.location.href;
        console.log("[callback-client] href:", href);

        // Debug: env presence (will be false if NEXT_PUBLIC vars are missing in client)
        console.log("[callback-client] env present?", {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        });

        // Works for both query (?code=...) and hash (#access_token=...) styles
        const hasHashAccessToken =
          typeof window !== "undefined" &&
          window.location.hash.includes("access_token=");
        const urlObj = new URL(href);
        const hasCode = !!urlObj.searchParams.get("code");

        let data: any = undefined;
        let error: any = undefined;

        if (hasHashAccessToken) {
          console.log("[callback-client] branch: setSession (hash/implicit)");
          // Parse tokens from the URL hash
          const hash = window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : window.location.hash;
          const hp = new URLSearchParams(hash);
          const access_token = hp.get("access_token") || "";
          const refresh_token = hp.get("refresh_token") || "";
          if (!access_token || !refresh_token) {
            error = {
              message: "Missing access_token or refresh_token in hash",
            };
          } else {
            const res = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            data = res.data;
            error = res.error;
          }
        } else if (hasCode) {
          console.log(
            "[callback-client] branch: exchangeCodeForSession (code/pkce)"
          );
          const res = await supabase.auth.exchangeCodeForSession(href);
          data = res.data;
          error = res.error;
        } else {
          console.log("[callback-client] branch: no tokens in URL");
          error = { message: "No tokens found in URL" };
        }

        console.log("[callback-client] exchange result:", {
          error,
          user: data?.session?.user?.id,
        });

        const next = search.get("next") || "/app/moje-knihovna";
        if (!error && data?.session?.user) {
          router.replace(next);
        } else {
          router.replace("/prihlaseni?mode=reset&msg=expired");
        }
      } catch (e) {
        console.error("[callback-client] unexpected error:", e);
        router.replace("/prihlaseni?mode=reset&msg=expired");
      }
    })();
  }, [router, search]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-sm text-gray-600">
        <div className="mb-2 font-medium">Kontrolujeme odkaz…</div>
        {/* Debug note: open DevTools → Console to see href and exchange result */}
        <div className="text-xs opacity-70">(debug logs in Console)</div>
      </div>
    </main>
  );
}
