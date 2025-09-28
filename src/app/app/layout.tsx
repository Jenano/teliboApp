import { ReactNode } from "react";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import "./globals.css";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await supabaseServerReadOnly();

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    redirect("/prihlaseni");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="font-['Fredoka'] text-xl text-[#2CC4B9]">
            TeliBo
          </Link>
          <div className="flex gap-4 text-teal-800">
            <Link href="/app/moje-knihovna" className="hover:underline">
              Moje knihovna
            </Link>
            <Link href="/app/knihovna" className="hover:underline">
              Knihovna
            </Link>
            <Link href="/app/slovicka" className="hover:underline">
              Moje slovíčka
            </Link>
          </div>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
