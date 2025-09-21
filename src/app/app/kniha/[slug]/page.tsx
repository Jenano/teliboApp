import { supabaseServerReadOnly } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";

async function getClient() {
  return supabaseServerReadOnly();
}

async function getBook(slug: string) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("books")
    .select(
      "id, slug, title_cs, title_en, description_cs, description_en, cover_url, age_min, age_max, pages_count"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data as any;
}

export default async function BookDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const book = await getBook(params.slug);
  if (!book) notFound();

  async function borrowAction(formData: FormData) {
    "use server";
    const supabase = await getClient();

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      redirect(`/prihlaseni?mode=login&from=/app/kniha/${book.slug}`);
    }

    const { error } = await supabase.from("user_books").upsert(
      {
        user_id: auth!.user!.id,
        book_id: book.id,
        current_seq: 1,
        completed: false,
      },
      { onConflict: "user_id,book_id" }
    );

    if (error) {
      redirect("/app/moje-knihovna");
      return;
    }

    redirect("/app/moje-knihovna");
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <div className="bg-white rounded-xl shadow p-3 border border-teal-100">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-teal-50 flex items-center justify-center">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title_cs}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-teal-600 text-sm p-2">Bez obálky</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-teal-100">
        <h1 className="text-2xl font-bold font-['Fredoka'] text-black">
          {book.title_cs}
        </h1>
        <p className="text-sm text-gray-600 italic">{book.title_en}</p>

        {(book.age_min || book.age_max) && (
          <p className="mt-2 text-sm text-gray-700">
            Doporučený věk: {book.age_min ?? "?"}–{book.age_max ?? "?"}
          </p>
        )}

        <div className="mt-4 space-y-2">
          {book.description_cs && (
            <p className="text-gray-800">{book.description_cs}</p>
          )}
          {book.description_en && (
            <p className="text-gray-500 italic">{book.description_en}</p>
          )}
        </div>

        <div className="mt-6">
          <form action={borrowAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#F6B949] hover:bg-[#E5A743] text-white font-semibold px-6 py-2 rounded-full shadow-md"
            >
              Půjčit knihu
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
