import Link from "next/link";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type Book = {
  id: string;
  slug: string;
  title_cs: string;
  title_en: string;
  cover_url: string | null;
  age_min: number | null;
  age_max: number | null;
};

export const revalidate = 0;

export default async function LibraryPage() {
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

  const { data, error } = await supabase
    .from("books")
    .select("id, slug, title_cs, title_en, cover_url, age_min, age_max")
    .eq("is_published", true)
    .order("title_cs", { ascending: true });

  if (error) {
    return <p className="text-red-600">Nepodařilo se načíst knihovnu.</p>;
  }

  const books = (data ?? []) as Book[];

  return (
    <section>
      <h1 className="text-2xl font-bold font-['Fredoka'] text-black mb-4">Knihovna</h1>

      {books.length === 0 ? (
        <p className="text-gray-600">Zatím žádné knihy.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {books.map((b) => (
            <li key={b.id} className="bg-white rounded-xl shadow p-3 border border-teal-100">
              <Link href={`/app/kniha/${b.slug}`} className="group block">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-teal-50 flex items-center justify-center">
                  {b.cover_url ? (
                    <img
                      src={b.cover_url}
                      alt={b.title_cs}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="text-teal-600 text-sm p-2">Bez obálky</span>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-teal-900 leading-snug">{b.title_cs}</h3>
                  <p className="text-xs text-gray-600 italic">{b.title_en}</p>
                  {(b.age_min || b.age_max) && (
                    <p className="text-xs text-gray-700 mt-1">
                      Věk: {b.age_min ?? "?"}–{b.age_max ?? "?"}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
