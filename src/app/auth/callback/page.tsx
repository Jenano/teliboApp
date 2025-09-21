"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const doExchange = async () => {
      const code = sp.get("code");
      const next = sp.get("next") || "/app/moje-knihovna";

      if (!code) {
        router.replace("/prihlaseni?mode=reset&msg=expired");
        return;
      }

      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("[callback] exchange error", error);
        router.replace("/prihlaseni?mode=reset&msg=expired");
        return;
      }

      // úspěch – pokračuj na stránku pro nastavení nového hesla
      router.replace(next);
    };

    doExchange();
  }, [router, sp]);

  return null;
}
