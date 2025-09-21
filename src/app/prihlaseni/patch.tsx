"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Mode = "login" | "register" | "reset";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlMode = (searchParams.get("mode") ?? "login") as Mode;
  const from = searchParams.get("from") || "/app/moje-knihovna";
  const [mode, setMode] = useState<Mode>(
    ["login", "register", "reset"].includes(urlMode) ? urlMode : "login"
  );

  useEffect(() => {
    const m = (searchParams.get("mode") ?? "login") as Mode;
    if (["login", "register", "reset"].includes(m) && m !== mode) setMode(m);
  }, [searchParams, mode]);

  function goMode(next: Mode) {
    setMode(next);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("mode", next);
    router.replace(`?${params.toString()}`);
  }
  const resetOk = (searchParams.get("reset") ?? "") === "ok";
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetSubmittedEmail, setResetSubmittedEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const expiredMsg = (searchParams.get("msg") ?? "") === "expired";
  const [signupDuplicate, setSignupDuplicate] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState("");
  const [resendBusyDup, setResendBusyDup] = useState(false);

  const [resetResendUsed, setResetResendUsed] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    password2?: string;
  }>({});
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    password2?: boolean;
  }>({});

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);

  function isValidEmail(v: string) {
    return /.+@.+\..+/.test(v);
  }

  function validate(
    v: { fullName: string; email: string; password: string; password2: string },
    m: Mode
  ) {
    const next: {
      fullName?: string;
      email?: string;
      password?: string;
      password2?: string;
    } = {};
    if (m === "register" && !v.fullName.trim()) {
      next.fullName = "Zadejte prosím jméno nebo přezdívku.";
    }
    if (!isValidEmail(v.email)) next.email = "Zadej platný e-mail.";
    if (m !== "reset" && v.password.length < 6)
      next.password = "Heslo musí mít alespoň 6 znaků.";
    if (m === "register" && v.password !== v.password2)
      next.password2 = "Hesla se neshodují.";
    return next;
  }

  function validateField(
    name: "fullName" | "email" | "password" | "password2"
  ) {
    const res = validate({ fullName, email, password, password2 }, mode);
    return res[name];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next = validate({ fullName, email, password, password2 }, mode);
    if (Object.keys(next).length > 0) {
      setErrors(next);
      // focus first invalid field
      if (next.fullName) fullNameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      else if (next.password) passwordRef.current?.focus();
      else if (next.password2) password2Ref.current?.focus();
      return;
    }

    if (mode === "login") {
      const supabase = supabaseBrowser();
      setAuthError(null);
      setEmailUnconfirmed(false);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const code = (error as any)?.code ?? "";
        const msg = ((error as any)?.message ?? "").toLowerCase();

        const isUnconfirmed =
          code === "email_not_confirmed" ||
          msg.includes("email not confirmed") ||
          msg.includes("confirm your email");

        const isInvalidCreds =
          code === "invalid_credentials" ||
          msg.includes("invalid login credentials");

        if (isUnconfirmed) {
          setEmailUnconfirmed(true);
          setAuthError(
            "Tento e‑mail je zaregistrovaný, ale ještě nebyl potvrzen."
          );
        } else if (isInvalidCreds) {
          setEmailUnconfirmed(false);
          setAuthError("Nesprávný e‑mail nebo heslo.");
        } else {
          setEmailUnconfirmed(false);
          setAuthError("Přihlášení se nepodařilo. Zkus to prosím znovu.");
        }
        return;
      }

      // success: mirror session to server cookies before redirect
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        await fetch("/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "SIGNED_IN",
            session: sessionData?.session,
          }),
        });
      } catch (e) {
        // even if the callback fails, attempt navigation; middleware may still redirect
        console.error("/auth/callback POST failed", e);
      }

      router.replace(from);
    } else if (mode === "register") {
      const supabase = supabaseBrowser();
      // reset duplicate banner before attempt
      setSignupDuplicate(false);
      const displayName = fullName.trim() || email.split("@")[0];
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: { name: displayName },
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();
        const isAlreadyRegistered =
          msg.includes("already registered") ||
          msg.includes("user already exists") ||
          ((error as any)?.status === 400 &&
            !msg.includes("weak") &&
            !msg.includes("password"));

        if (isAlreadyRegistered) {
          setSignupDuplicate(true);
          setDuplicateEmail(email);
          // clear sensitive fields
          setPassword("");
          setPassword2("");
          return; // do not show success panel
        }

        console.error("Supabase signUp error:", error);
        setAuthError("Registrace se nepodařila. Zkus to prosím znovu.");
        return;
      }

      // Detect "already registered" case when Supabase returns a user with no identities (no error thrown)
      // See: Supabase behavior — signUp may return user with empty identities[] if the email already exists.
      const alreadyExists =
        data?.user &&
        Array.isArray((data.user as any).identities) &&
        (data.user as any).identities.length === 0;

      if (alreadyExists) {
        setSignupDuplicate(true);
        setDuplicateEmail(email);
        // clear sensitive fields and stop; do NOT show success panel
        setPassword("");
        setPassword2("");
        return;
      }

      // If auto-confirm (dev) returns a session immediately, mirror cookies then go straight in
      if (data?.session) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          await fetch("/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "SIGNED_IN",
              session: sessionData?.session,
            }),
          });
        } catch (e) {
          console.error("/auth/callback POST failed (signup)", e);
        }
        router.replace(from);
        return;
      }

      // Otherwise show confirmation panel
      setSubmitted(true);
      setSubmittedEmail(email);
      setPassword("");
      setPassword2("");
      setErrors({});
      setTouched({});
      // Optionally also clear non-sensitive fields
      // setEmail("");
      // setFullName("");
    } else if (mode === "reset") {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/callback?next=/reset-hesla`,
      });
      if (!error) {
        setResetSubmitted(true);
        setResetSubmittedEmail(email);
        // Optionally clear so it's not left in UI
        // setEmail("");
      } else {
        console.error("Supabase resetPasswordForEmail error:", error);
        alert(error.message);
        return;
      }
    }
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex w-full mb-6 rounded-lg overflow-hidden border border-teal-300">
        <button
          type="button"
          onClick={() => goMode("login")}
          className={`flex-1 py-3 text-center font-medium transition ${
            mode === "login"
              ? "bg-teal-500 text-white"
              : "bg-teal-50 text-teal-900 hover:bg-teal-100"
          }`}
          aria-pressed={mode === "login"}
        >
          Přihlášení
        </button>
        <button
          type="button"
          onClick={() => goMode("register")}
          className={`flex-1 py-3 text-center font-medium transition ${
            mode === "register"
              ? "bg-teal-500 text-white"
              : "bg-teal-50 text-teal-900 hover:bg-teal-100"
          }`}
          aria-pressed={mode === "register"}
        >
          Registrace
        </button>
      </div>

      {/* Form or Confirmation Panel */}
      {mode === "register" && submitted ? (
        <div className="flex flex-col gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-teal-900">
            Je to na cestě ✉️
          </h2>
          <p className="text-sm text-teal-900">
            Poslali jsme Ti potvrzovací e‑mail na{" "}
            <span className="font-semibold">{submittedEmail}</span>. Otevři ho a
            potvrď registraci. Poté se vrátíš zpět do aplikace.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goMode("login")}
              className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 py-2 px-3 rounded-md font-medium"
            >
              Otevřít e‑mail později
            </button>
            <button
              type="button"
              onClick={async () => {
                const supabase = supabaseBrowser();
                try {
                  await supabase.auth.resend({
                    type: "signup",
                    email: submittedEmail,
                    options: {
                      emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                  });
                  alert("Znovu odesláno. Zkontroluj prosím e‑mail.");
                } catch (err) {
                  console.error(err);
                  alert("Nepodařilo se odeslat e‑mail ještě jednou.");
                }
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-md font-medium shadow-md"
            >
              Zkusit poslat znovu
            </button>
          </div>

          <ul className="list-disc list-inside text-xs text-teal-900/90">
            <li>Zkontrolujte složku Spam.</li>
          </ul>

          <div className="text-xs text-teal-900/90 flex gap-3">
            <a
              className="underline"
              href="https://mail.google.com"
              target="_blank"
            >
              Gmail
            </a>
            <a
              className="underline"
              href="https://email.seznam.cz"
              target="_blank"
            >
              Seznam
            </a>
            <a
              className="underline"
              href="https://outlook.live.com"
              target="_blank"
            >
              Outlook
            </a>
          </div>
        </div>
      ) : mode === "reset" && resetSubmitted ? (
        <div className="flex flex-col gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-teal-900">
            E‑mail byl odeslán ✉️
          </h2>
          <p className="text-sm text-teal-900">
            Poslali jsme ti odkaz pro změnu hesla na{" "}
            <span className="font-semibold">{resetSubmittedEmail}</span>. Otevři
            e‑mail a klikni na odkaz, poté tě přesměrujeme zpět do aplikace.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goMode("login")}
              className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 py-2 px-3 rounded-md font-medium"
            >
              Pokračovat na přihlášení
            </button>
            {!resetResendUsed ? (
              <button
                type="button"
                onClick={async () => {
                  const supabase = supabaseBrowser();
                  try {
                    await supabase.auth.resetPasswordForEmail(
                      resetSubmittedEmail,
                      {
                        redirectTo: `${location.origin}/auth/callback?next=/reset-hesla`,
                      }
                    );
                  } catch (e) {
                    console.error(e);
                  } finally {
                    // after one attempt, hide the button to prevent further requests
                    setResetResendUsed(true);
                  }
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-md font-medium shadow-md"
              >
                Poslat znovu
              </button>
            ) : (
              <span role="status" className="text-sm text-teal-800">
                E‑mail byl znovu odeslán. Zkontroluj schránku.
              </span>
            )}
          </div>

          <ul className="list-disc list-inside text-xs text-teal-900/90">
            <li>Zkontrolujte složku Spam.</li>
          </ul>

          <div className="text-xs text-teal-900/90 flex gap-3">
            <a
              className="underline"
              href="https://mail.google.com"
              target="_blank"
            >
              Gmail
            </a>
            <a
              className="underline"
              href="https://email.seznam.cz"
              target="_blank"
            >
              Seznam
            </a>
            <a
              className="underline"
              href="https://outlook.live.com"
              target="_blank"
            >
              Outlook
            </a>
          </div>
        </div>
      ) : mode === "register" && signupDuplicate ? (
        <div className="flex flex-col gap-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-teal-900">
            Účet už existuje
          </h2>
          <p className="text-sm text-teal-900">
            E‑mail <span className="font-semibold">{duplicateEmail}</span> už je
            u nás registrovaný. Pokud jsi nepotvrdil(a) registraci, můžeš si
            nechat potvrzovací e‑mail poslat znovu.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => goMode("login")}
              className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-md font-medium shadow-md"
            >
              Přihlásit se
            </button>

            <button
              type="button"
              onClick={() => goMode("reset")}
              className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 py-2 px-3 rounded-md font-medium"
            >
              Zapomenuté heslo
            </button>

            <button
              type="button"
              disabled={resendBusyDup}
              onClick={async () => {
                try {
                  setResendBusyDup(true);
                  const sb = supabaseBrowser();
                  await sb.auth.resend({
                    type: "signup",
                    email: duplicateEmail,
                    options: {
                      emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                  });
                  // Optional: show a toast or inline note
                } catch (e) {
                  console.error(e);
                } finally {
                  setResendBusyDup(false);
                }
              }}
              className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 py-2 px-3 rounded-md font-medium disabled:opacity-60"
            >
              {resendBusyDup ? "Odesílám…" : "Poslat potvrzení znovu"}
            </button>
          </div>

          <ul className="list-disc list-inside text-xs text-teal-900/90">
            <li>Zkontrolujte složku Spam.</li>
            <li>
              Otevřete potvrzovací odkaz ze stejného zařízení a prohlížeče.
            </li>
          </ul>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Full name -- registration only */}
          {mode === "register" && (
            <label className="flex flex-col text-sm text-gray-900">
              Jméno nebo přezdívka
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    const msg = validateField("fullName");
                    if (!msg)
                      setErrors((er) => ({ ...er, fullName: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, fullName: true }));
                  const msg = validateField("fullName");
                  setErrors((er) => ({ ...er, fullName: msg }));
                }}
                ref={fullNameRef}
                required
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
                className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                  errors.fullName
                    ? "border border-red-500 focus:ring-red-400"
                    : "border border-teal-300 focus:ring-teal-400"
                }`}
                placeholder="Honza"
                autoComplete="name"
              />
              {touched.fullName && errors.fullName && (
                <p
                  id="fullName-error"
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.fullName}
                </p>
              )}
            </label>
          )}

          {/* Email */}
          <label className="flex flex-col text-sm text-gray-900">
            E‑mail
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  const msg = validateField("email");
                  if (!msg) setErrors((er) => ({ ...er, email: undefined }));
                }
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, email: true }));
                const msg = validateField("email");
                setErrors((er) => ({ ...er, email: msg }));
              }}
              ref={emailRef}
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                errors.email
                  ? "border border-red-500 focus:ring-red-400"
                  : "border border-teal-300 focus:ring-teal-400"
              }`}
              placeholder="např. rodic@telibo.cz"
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email}
              </p>
            )}
          </label>

          {/* Passwords */}
          {mode !== "reset" && (
            <label className="flex flex-col text-sm text-gray-900">
              Heslo
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    const msg = validateField("password");
                    if (!msg)
                      setErrors((er) => ({ ...er, password: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, password: true }));
                  const msg = validateField("password");
                  setErrors((er) => ({ ...er, password: msg }));
                }}
                ref={passwordRef}
                required
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                  errors.password
                    ? "border border-red-500 focus:ring-red-400"
                    : "border border-teal-300 focus:ring-teal-400"
                }`}
                placeholder="●●●●●●●●"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
              {touched.password && errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </label>
          )}

          {mode === "register" && (
            <label className="flex flex-col text-sm text-gray-900">
              Potvrzení hesla
              <input
                type="password"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  if (errors.password2) {
                    const msg = validateField("password2");
                    if (!msg)
                      setErrors((er) => ({ ...er, password2: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, password2: true }));
                  const msg = validateField("password2");
                  setErrors((er) => ({ ...er, password2: msg }));
                }}
                ref={password2Ref}
                required
                aria-invalid={errors.password2 ? true : undefined}
                aria-describedby={
                  errors.password2 ? "password2-error" : undefined
                }
                className={`rounded-md p-2 mt-1 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                  errors.password2
                    ? "border border-red-500 focus:ring-red-400"
                    : "border border-teal-300 focus:ring-teal-400"
                }`}
                placeholder="●●●●●●●●"
                autoComplete="new-password"
              />
              {mode === "register" && touched.password2 && errors.password2 && (
                <p
                  id="password2-error"
                  role="alert"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.password2}
                </p>
              )}
            </label>
          )}

          {/* Optional success banner after reset */}
          {mode === "login" && resetOk && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2">
              Heslo bylo změněno. Přihlas se novým heslem.
            </p>
          )}

          {/* Forgot password */}
          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => goMode("reset")}
                className="text-sm text-teal-800 hover:underline"
              >
                Zapomenuté heslo?
              </button>
            </div>
          )}

          {/* Reset note and expired warning */}
          {mode === "reset" && (
            <>
              {expiredMsg && (
                <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
                  <p className="font-medium mb-1">
                    Odkaz vypršel nebo je neplatný
                  </p>
                  <p className="text-sm">Zadej e‑mail a pošleme ti nový.</p>
                </div>
              )}
              <p className="text-xs text-teal-800 bg-teal-50 border border-teal-200 rounded-md p-2">
                Po odeslání Vám pošleme e‑mail s odkazem pro nastavení nového
                hesla.
              </p>
            </>
          )}

          {/* Inline login warnings/errors */}
          {mode === "login" && emailUnconfirmed && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
              <p className="font-medium mb-2">E-mail není potvrzený</p>
              <p className="mb-3">
                Tento e-mail je zaregistrovaný, ale ještě nebyl potvrzen.
                Zkontroluj prosím svou schránku a klikni na potvrzovací odkaz.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={resendBusy}
                  onClick={async () => {
                    try {
                      setResendBusy(true);
                      const supabase = supabaseBrowser();
                      await supabase.auth.resend({
                        type: "signup",
                        email,
                        options: {
                          emailRedirectTo: `${location.origin}/auth/callback`,
                        },
                      });
                      setAuthError("Poslali jsme potvrzovací e-mail znovu.");
                    } catch (e) {
                      setAuthError(
                        "Nepodařilo se odeslat potvrzovací e-mail. Zkus to za chvíli."
                      );
                    } finally {
                      setResendBusy(false);
                    }
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-3 rounded-md font-medium disabled:opacity-60"
                >
                  {resendBusy ? "Odesílám…" : "Poslat znovu"}
                </button>
                <button
                  type="button"
                  onClick={() => goMode("reset")}
                  className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-700 py-1.5 px-3 rounded-md font-medium"
                >
                  Zapomněl(a) jsi heslo?
                </button>
              </div>
            </div>
          )}

          {mode === "login" && authError && !emailUnconfirmed && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {authError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-medium shadow-md"
          >
            {mode === "login" && "Přihlásit se"}
            {mode === "register" && "Vytvořit účet"}
            {mode === "reset" && "Poslat odkaz pro změnu hesla"}
          </button>

          {/* Back from reset */}
          {mode === "reset" && (
            <button
              type="button"
              onClick={() => goMode("login")}
              className="text-sm text-teal-800 hover:underline mx-auto"
            >
              Zpět na přihlášení
            </button>
          )}

          {/* Divider */}
          <div className="flex items-center my-1">
            <div className="h-px flex-1 bg-teal-200" />
            <span className="px-2 text-xs text-teal-800">nebo</span>
            <div className="h-px flex-1 bg-teal-200" />
          </div>

          {/* Social (placeholder) */}
          <button
            type="button"
            className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 py-2 rounded-md font-medium"
            onClick={() => alert("TODO: přihlášení přes Google")}
          >
            Pokračovat s Google
          </button>
        </form>
      )}

      {/* Small helper copy */}
      <p className="text-[11px] text-teal-900 mt-4 text-center">
        Registrací souhlasíte s&nbsp;
        <a href="/podminky" className="underline">
          podmínkami používání
        </a>
        .
      </p>
    </div>
  );
}
