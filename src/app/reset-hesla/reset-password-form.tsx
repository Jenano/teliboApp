"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

// If your project uses a different import path for the client helper, e.g. "@/supabaseClient",
// adjust the import above accordingly.

export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit = useMemo(() => {
    return !pending && password.length >= 8 && password === confirm;
  }, [pending, password, confirm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Heslo musí mít alespoň 8 znaků.");
      return;
    }
    if (password !== confirm) {
      setError("Hesla se neshodují.");
      return;
    }

    setPending(true);
    try {
      // Ensure we still have a session coming from the verified link
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        // Rare, but surface it
        setError(userErr.message);
        setPending(false);
        return;
      }
      if (!userData?.user) {
        // If there is no session here, the reset link/session likely expired or was consumed.
        router.replace("/prihlaseni?mode=reset&msg=expired");
        return;
      }

      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        setError(updateErr.message);
        setPending(false);
        return;
      }

      setSuccess("Heslo bylo úspěšně změněno. Přesměrovávám…");

      // After a successful password update during a password recovery session,
      // the user remains signed in. Send them to their library.
      router.replace("/app/moje-knihovna");
    } catch (err: any) {
      setError(err?.message ?? "Nastala neočekávaná chyba.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[60vh] md:min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.07)] border border-[#F2EFEA] p-8">
        <h1 className="text-3xl font-['Fredoka'] font-bold text-[#2CC4B9] mb-2">
          Nastavit nové heslo
        </h1>
        <p className="text-sm text-[#6B7280] mb-8">
          Zadej nové heslo. Po úspěšné změně tě přesměrujeme do aplikace.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#111827] mb-1"
            >
              Nové heslo
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none focus:ring-2 focus:ring-[#2CC4B9] focus:border-transparent transition"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#2CC4B9] hover:opacity-80"
              >
                {showPwd ? "Skrýt" : "Zobrazit"}
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">Minimálně 8 znaků.</p>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-[#111827] mb-1"
            >
              Potvrdit heslo
            </label>
            <input
              id="confirm"
              type={showPwd ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none focus:ring-2 focus:ring-[#2CC4B9] focus:border-transparent transition"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-2">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-[#2CC4B9] hover:bg-[#27b1a7] text-white py-3 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Ukládám…" : "Nastavit heslo"}
          </button>
        </form>
      </div>
    </div>
  );
}
