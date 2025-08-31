"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ResetHeslaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{
    password?: boolean;
    password2?: boolean;
  }>({});
  const passRef = useRef<HTMLInputElement>(null);
  const pass2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      const user = data.user;
      if (!user) {
        router.replace("/prihlaseni?mode=reset&msg=expired");
        return;
      }
      setEmail(user.email ?? null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  function validate() {
    const errs: { password?: string; password2?: string } = {};
    if (password.length < 6) errs.password = "Heslo musí mít alespoň 6 znaků.";
    if (password !== password2) errs.password2 = "Hesla se neshodují.";
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setError(null);
      if (errs.password) passRef.current?.focus();
      else if (errs.password2) pass2Ref.current?.focus();
      return;
    }

    const supabase = supabaseBrowser();
    try {
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) throw upErr;
      await supabase.auth.signOut();
      router.replace("/prihlaseni?mode=login&reset=ok");
    } catch (e: any) {
      setError(e?.message || "Nepodařilo se nastavit nové heslo.");
    }
  }

  if (loading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-teal-900">
          Nastavit nové heslo
        </h1>
        {email && (
          <p className="mb-2 text-sm text-gray-700">Pro účet: {email}</p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-sm text-gray-900">
            Nové heslo
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              ref={passRef}
              required
              aria-invalid={
                touched.password && password.length < 6 ? true : undefined
              }
              className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                touched.password && password.length < 6
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-teal-300 focus:ring-teal-400"
              }`}
              placeholder="●●●●●●●●"
              autoComplete="new-password"
            />
            {touched.password && password.length < 6 && (
              <p className="mt-1 text-sm text-red-600">
                Heslo musí mít alespoň 6 znaků.
              </p>
            )}
          </label>

          <label className="flex flex-col text-sm text-gray-900">
            Potvrzení nového hesla
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password2: true }))}
              ref={pass2Ref}
              required
              aria-invalid={
                touched.password2 && password !== password2 ? true : undefined
              }
              className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                touched.password2 && password !== password2
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-teal-300 focus:ring-teal-400"
              }`}
              placeholder="●●●●●●●●"
              autoComplete="new-password"
            />
            {touched.password2 && password !== password2 && (
              <p className="mt-1 text-sm text-red-600">Hesla se neshodují.</p>
            )}
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-medium shadow-md"
          >
            Uložit nové heslo
          </button>
        </form>
      </div>
    </main>
  );
}
