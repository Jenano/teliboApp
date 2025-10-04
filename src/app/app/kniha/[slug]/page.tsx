import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getBookBySlug } from "@/lib/repos/books";
import { supabaseServerReadOnly } from "@/lib/supabaseServer";

export default async function BookDetailPage({ params }: any) {
  const book = await getBookBySlug(params.slug).catch(() => null);
  if (!book) notFound();

  async function borrowAction() {
    "use server";
    const sb = await supabaseServerReadOnly();
    const { data: auth } = await sb.auth.getUser();

    if (!auth?.user) {
      redirect(`/prihlaseni?mode=login&from=/app/kniha/${book!.slug}`);
    }

    await sb.from("user_books").upsert(
      {
        user_id: auth!.user!.id,
        book_id: book!.id,
        current_seq: 1,
        completed: false,
      },
      { onConflict: "user_id,book_id" }
    );

    redirect("/app/moje-knihovna");
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <div className="bg-white rounded-xl shadow p-3 border border-teal-100">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-teal-50 flex items-center justify-center">
          {book.cover_url ? (
            <Image
              src={book.cover_url ?? "/placeholder-cover.png"}
              alt={book.title_cs ?? "Bez obálky"}
              width={280}
              height={370}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <Image
              src="/placeholder-cover.png"
              alt="Bez obálky"
              width={280}
              height={370}
              className="opacity-50 rounded-lg"
            />
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
