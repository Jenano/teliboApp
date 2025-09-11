import { ReactNode } from "react";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AppLayout({ children }: { children: ReactNode }) {
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

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

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
