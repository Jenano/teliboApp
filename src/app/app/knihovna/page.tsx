import Link from "next/link";
import Image from "next/image";
import { listPublishedBooks } from "@/lib/repos/books";

export const revalidate = 0;

export default async function LibraryPage() {
  const books = await listPublishedBooks();

  return (
    <section>
      <h1 className="text-2xl font-bold font-['Fredoka'] text-black mb-4">
        Knihovna
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-600">Zatím žádné knihy.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {books.map((b) => (
            <li
              key={b.id}
              className="bg-white rounded-xl shadow p-3 border border-teal-100"
            >
              <Link href={`/app/kniha/${b.slug}`} className="group block">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-teal-50 flex items-center justify-center">
                  {b.cover_url ? (
                    <Image
                      src={b.cover_url ?? "/placeholder-cover.png"}
                      alt={b.title_cs}
                      width={300}
                      height={400}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02] rounded-lg"
                      unoptimized={b.cover_url?.startsWith("http")}
                      priority={false}
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
                    {b.title_cs}
                  </h3>
                  {/* Removed title_en and age range display as listPublishedBooks only returns id, slug, title_cs, cover_url */}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
