import Link from "next/link";
import Image from "next/image";
import Filters from "./Filters";
import { redirect } from "next/navigation";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { listUserLibrary } from "@/lib/repos/books";

export const revalidate = 0;

export default async function MyLibraryPage({ searchParams }: any) {
  const statusParam = (searchParams?.status as string) ?? "all";
  const status = ["all", "reading", "finished"].includes(statusParam)
    ? statusParam
    : "all";

  const sb = await supabaseServerReadOnly();
  const { data: auth } = await sb.auth.getUser();
  const user = auth?.user;
  if (!user) {
    redirect("/prihlaseni?mode=login&from=/app/moje-knihovna");
  }

  // Fetch all items (could be filtered in SQL if status != all)
  let rawItems = await listUserLibrary(user!.id);
  // Derive a status field from completed flag since repo returns completed/current_seq
  const items = rawItems.map((i: any) => ({
    ...i,
    status: i.completed ? "finished" : "reading",
  }));
  const filtered =
    status === "all" ? items : items.filter((i: any) => i.status === status);

  if (items.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4 text-gray-600">Zatím nemáte žádné knihy…</p>
        <Link
          href="/app/knihovna"
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium shadow-md"
        >
          Procházet knihovnu
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-['Fredoka'] text-black">
          Moje knihovna
        </h1>
        <Filters active={status as any} />
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((row: any, idx: number) => {
          const b = row.books;
          if (!b) return null;
          const progress = Math.max(
            0,
            Math.min(100, row.progress_percent ?? 0)
          );
          return (
            <li
              key={`${b.slug}-${idx}`}
              className="bg-white rounded-xl shadow p-3 border border-teal-100"
            >
              <Link href={`/app/kniha/${b.slug}`} className="group block">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-teal-50 relative">
                  {b.cover_url ? (
                    <Image
                      src={b.cover_url}
                      alt={b.title_cs ?? b.slug}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-teal-50 text-teal-700 text-center rounded-lg border border-teal-100">
                      <Image
                        src="/placeholder-cover.png"
                        alt="Chybí obálka"
                        width={64}
                        height={64}
                        className="opacity-70 mb-2"
                      />
                      <span className="text-sm font-medium">Chybí obálka</span>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-teal-900 leading-snug">
                    {b.title_cs ?? b.slug}
                  </h3>
                  {row.status === "finished" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-700 mt-1">
                      ✅ Hotovo
                    </span>
                  ) : (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded">
                        <div
                          className="h-1.5 bg-teal-500 rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-700">{progress}%</span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
