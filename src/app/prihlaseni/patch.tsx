"use client";
import { useState } from "react";

type Mode = "login" | "register" | "reset";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "register" && password !== password2) {
      alert("Hesla se neshodují.");
      return;
    }

    if (mode === "login") {
      console.log("Login submit", { email, password });
      // TODO: supabaseBrowser().auth.signInWithPassword({ email, password })
    } else if (mode === "register") {
      console.log("Register submit", { email, password });
      // TODO: supabaseBrowser().auth.signUp({ email, password })
    } else if (mode === "reset") {
      console.log("Reset password submit", { email });
      // TODO: supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback` })
    }
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex w-full mb-6 rounded-lg overflow-hidden border border-teal-300">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-3 text-center font-medium transition ${
            mode === "login"
              ? "bg-teal-500 text-white"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
          }`}
          aria-pressed={mode === "login"}
        >
          Přihlášení
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-3 text-center font-medium transition ${
            mode === "register"
              ? "bg-teal-500 text-white"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
          }`}
          aria-pressed={mode === "register"}
        >
          Registrace
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <label className="flex flex-col text-sm">
          E‑mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-teal-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="např. rodic@telibo.cz"
            autoComplete="email"
          />
        </label>

        {/* Passwords */}
        {mode !== "reset" && (
          <label className="flex flex-col text-sm">
            Heslo
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-teal-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="●●●●●●●●"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>
        )}

        {mode === "register" && (
          <label className="flex flex-col text-sm">
            Potvrzení hesla
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="border border-teal-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="●●●●●●●●"
              autoComplete="new-password"
            />
          </label>
        )}

        {/* Forgot password */}
        {mode === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-sm text-teal-700 hover:underline"
            >
              Zapomenuté heslo?
            </button>
          </div>
        )}

        {/* Reset note */}
        {mode === "reset" && (
          <p className="text-xs text-teal-800 bg-teal-50 border border-teal-200 rounded-md p-2">
            Po odeslání ti pošleme e‑mail s odkazem pro nastavení nového hesla.
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
            onClick={() => setMode("login")}
            className="text-sm text-teal-700 hover:underline mx-auto"
          >
            Zpět na přihlášení
          </button>
        )}

        {/* Divider */}
        <div className="flex items-center my-1">
          <div className="h-px flex-1 bg-teal-200" />
          <span className="px-2 text-xs text-teal-700">nebo</span>
          <div className="h-px flex-1 bg-teal-200" />
        </div>

        {/* Social (placeholder) */}
        <button
          type="button"
          className="border border-teal-300 bg-white hover:bg-teal-50 text-teal-700 py-2 rounded-md font-medium"
          onClick={() => alert("TODO: přihlášení přes Google")}
        >
          Pokračovat s Google
        </button>
      </form>

      {/* Small helper copy */}
      <p className="text-[11px] text-teal-800/80 mt-4 text-center">
        Registrací souhlasíš s&nbsp;
        <a href="/podminky" className="underline">
          podmínkami používání
        </a>
        .
      </p>
    </div>
  );
}
