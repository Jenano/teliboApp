import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import Filters from "./Filters";

export const revalidate = 0;

type Row = {
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

type Props = { searchParams: { status?: "all" | "reading" | "finished" } };

export default async function MyLibraryPage({ searchParams }: Props) {
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

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const status = (searchParams.status ?? "all") as
    | "all"
    | "reading"
    | "finished";

  let query = supabase
    .from("user_books")
    .select(
      "status, progress_percent, books:book_id (id, slug, title, author, cover_path)"
    )
    .eq("user_id", user.id) as any;

  if (status !== "all") query = query.eq("status", status);

  const { data: rows, error } = await query;
  if (error) {
    return <p className="text-red-600">Nepodařilo se načíst knihy.</p>;
  }

  const items = (rows ?? []) as Row[];

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4 text-gray-600">No books yet…</p>
        <Link
          href="/app/knihovna"
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium shadow-md"
        >
          Browse Library
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
        {items.map((row, idx) => {
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
