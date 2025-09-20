"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Filters from "./Filters";
import { supabaseBrowser } from "@/lib/supabaseClient";

export type Row = {
  status: "reading" | "finished";
  progress_percent: number | null;
  books: {
    id: string;
    slug: string;
    title: string | null;
    author: string | null;
    cover_path: string | null;
  } | null;
};

type DbRowBook = {
  id: string;
  slug: string;
  title: string | null;
  author: string | null;
  cover_path: string | null;
};

// Shape that may come back from Supabase when selecting a related table.
// Sometimes the related object is returned as an array; we normalize it.
type DbRow = {
  status: "reading" | "finished";
  progress_percent: number | null;
  books: DbRowBook | DbRowBook[] | null;
};

export default function MyLibraryPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [items, setItems] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const status = (sp.get("status") ?? "all") as "all" | "reading" | "finished";

  useEffect(() => {
    let isMounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      // 1) Ensure user is logged in. If not, send to /prihlaseni.
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user ?? null;
      if (!user) {
        router.replace("/prihlaseni?mode=login&next=/app/moje-knihovna");
        return;
      }

      // 2) Load user's books (optionally filtered by status)
      let query = supabase
        .from("user_books")
        .select(
          "status, progress_percent, books:book_id (id, slug, title, author, cover_path)"
        )
        .eq("user_id", user.id);

      if (status !== "all") query = query.eq("status", status);

      const { data, error: qError } = await query;
      if (!isMounted) return;

      if (qError) {
        setError("Nepodařilo se načíst knihy.");
        setItems([]);
      } else {
        // Normalize potential array/object shape from Supabase relation select.
        const normalized: Row[] =
          ((data ?? []) as DbRow[]).map((r) => {
            const book = Array.isArray(r.books) ? r.books[0] ?? null : r.books;
            return {
              status: r.status,
              progress_percent: r.progress_percent,
              books: book,
            };
          }) ?? [];

        setItems(normalized);
      }
      setLoading(false);
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [status, router, supabase]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Načítám knihy…</div>;
  }

  if (error) {
    return <p className="text-red-600 p-4">{error}</p>;
  }

  const list = items ?? [];

  if (list.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4 text-gray-600">Žádné knihy…</p>
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
        <Filters active={status} />
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {list.map((row, idx) => {
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
                  {b.cover_path ? (
                    <Image
                      src={b.cover_path}
                      alt={b.title ?? b.slug}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-teal-600 text-sm p-2">
                      Bez obálky
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-teal-900 leading-snug">
                    {b.title ?? b.slug}
                  </h3>
                  {b.author && (
                    <p className="text-xs text-gray-600 italic">{b.author}</p>
                  )}

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
