import Link from "next/link";
import Image from "next/image";
import { listPublishedBooks } from "@/lib/repos/books";
import React from "react";

export const revalidate = 0;

/**
 * Pastel chip for a single statistic.
 * Variant controls color theme.
 */
function StatChip({
  value,
  label,
  variant = "teal",
  icon,
}: {
  value: number | string | null | undefined;
  label: string;
  variant?: "teal" | "yellow" | "green";
  icon?: React.ReactNode;
}) {
  const theme =
    variant === "teal"
      ? { wrap: "bg-teal-100 text-teal-700", value: "text-sm font-bold" }
      : variant === "yellow"
      ? { wrap: "bg-yellow-100 text-yellow-700", value: "text-sm font-bold" }
      : { wrap: "bg-green-100 text-green-700", value: "text-sm font-bold" };

  const display =
    typeof value === "number" ? value : typeof value === "string" ? value : "—";

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${theme.wrap}`}
      aria-label={label}
      title={label}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <span className={theme.value}>{display}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

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
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {books.map((b) => {
            // Prefer normalized fields; fall back to any-typed legacy names if present
            const minutes =
              (b as any).duration_minutes ??
              (b as any).audio_minutes ??
              (b as any).duration ??
              null;
            const pages =
              (b as any).pages_count ?? (b as any).page_count ?? null;
            const words =
              (b as any).new_word_count ?? (b as any).number_of_words ?? null;

            return (
              <li key={b.id} className="flex justify-center">
                <Link href={`/app/kniha/${b.slug}`} className="group block">
                  <div className="w-[240px] h-[360px] flex flex-col rounded-2xl overflow-hidden bg-white shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
                    {/* Cover with gradient overlay */}
                    <div className="relative w-full flex-auto min-h-[140px] max-h-[230px] overflow-hidden">
                      <Image
                        src={b.cover_url ?? "/placeholder-cover.png"}
                        alt={b.title_cs}
                        width={480}
                        height={320}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={b.cover_url?.startsWith("http")}
                        priority={false}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/90 to-transparent z-[1]" />
                    </div>

                    {/* Content */}
                    <div className="p-4 text-center flex-none flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[3.25rem]">
                        {b.title_cs}
                      </h3>
                      {Boolean((b as any).title_en) && (
                        <p className="text-xs text-gray-500 italic mt-0.5 mb-2">
                          {(b as any).title_en}
                        </p>
                      )}

                      {/* Unified stat row */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 justify-center">
                        <StatChip
                          value={minutes}
                          label="min"
                          variant="teal"
                          icon={<span>⏱️</span>}
                        />
                        <StatChip
                          value={pages}
                          label="pages"
                          variant="yellow"
                          icon={<span>📄</span>}
                        />
                        <StatChip
                          value={words}
                          label="words"
                          variant="green"
                          icon={<span>✨</span>}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
