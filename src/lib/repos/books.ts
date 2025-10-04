// src/lib/repos/books.ts
import { cache } from "react";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

/**
 * Unify cover URL resolution in one place:
 * - If it's absolute (http/https), keep it.
 * - If it starts with /storage/, prefix with NEXT_PUBLIC_SUPABASE_URL.
 * - Otherwise treat it as filename in public bucket "covers".
 */
export function resolveCoverUrl(raw?: string | null): string | null {
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  if (raw.startsWith("/storage/")) {
    return `${base}${raw}`;
  }

  return `${base}/storage/v1/object/public/covers/${raw}`;
}

/** Public, published book detail by slug (SSR cached). */
export const getBookBySlug = cache(async (slug: string) => {
  const sb = await supabaseServerReadOnly();
  const { data, error } = await sb
    .from("books")
    .select(
      "id, slug, title_cs, title_en, description_cs, description_en, cover_url, age_min, age_max, pages_count"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { ...data, cover_url: resolveCoverUrl(data.cover_url) };
});

/** Public catalog (for “Knihovna” grid without user context). */
export const listPublishedBooks = cache(async () => {
  const sb = await supabaseServerReadOnly();
  const { data, error } = await sb
    .from("books")
    .select("id, slug, title_cs, cover_url")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((b) => ({
    ...b,
    cover_url: resolveCoverUrl(b.cover_url),
  }));
});

/** User’s library (join user_books -> books). Adjust column names if needed. */
export const listUserLibrary = cache(async (userId: string) => {
  const sb = await supabaseServerReadOnly();
  const { data, error } = await sb
    .from("user_books")
    .select(
      `
      completed,
      current_seq,
      books:book_id (
        id, slug, title_cs, cover_url
      )
    `
    )
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    ...row,
    books: row.books
      ? { ...row.books, cover_url: resolveCoverUrl(row.books.cover_url) }
      : null,
  }));
});
