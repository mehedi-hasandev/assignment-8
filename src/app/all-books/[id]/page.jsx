import Link from "next/link";
import { notFound } from "next/navigation";
import BookCover from "@/components/book-cover";

const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";

async function getBook(id) {
  let response;

  try {
    response = await fetch(
      `${BOOKS_API_URL}/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error(
      "Could not connect to the book server. Make sure it is running and try again.",
    );
  }

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`The book server returned an error (${response.status}).`);
  }

  const book = await response.json();
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    throw new Error("The book server returned an invalid response.");
  }

  return book;
}

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  let book = null;
  let error = "";

  try {
    book = await getBook(id);
  } catch (problem) {
    error =
      problem instanceof Error
        ? problem.message
        : "Could not load this book. Please try again.";
  }

  if (!book && !error) notFound();

  if (error) {
    return (
      <main className="flex-1 bg-[#0b1510] px-4 py-16 text-white sm:px-6">
        <section
          role="alert"
          className="mx-auto max-w-2xl rounded-xl border border-red-400/20 bg-red-950/30 p-6 text-center sm:p-8"
        >
          <h1 className="text-xl font-semibold text-red-200">
            Book details unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-red-100/70">{error}</p>
          <Link
            href="/all-books"
            className="mt-6 inline-flex rounded-md bg-emerald-300 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Back to All Books
          </Link>
        </section>
      </main>
    );
  }

  const title = book.bookTitle || book.title || "Untitled";
  const author = book.authorName || book.author || "Unknown author";
  const category = book.category || "Uncategorized";
  const imageUrl = book.bookImage || book.imageUrl || book.coverImage || "";
  const description =
    book.shortDescription || book.description || "No description available.";
  const ownerName =
    book.userName || book.addedBy?.name || book.ownerName || "BookNook member";
  const ownerEmail =
    book.userEmail || book.addedBy?.email || book.ownerEmail || "";
  const copiesLeft = Number(
    book.availableCopies ?? book.copiesLeft ?? book.totalCopies,
  );
  const canRequestBook =
    ownerEmail.includes("@") && Number.isFinite(copiesLeft) && copiesLeft > 0;
  const borrowLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(
    `Borrow request: ${title}`,
  )}&body=${encodeURIComponent(
    `Hello ${ownerName},\n\nI would like to borrow "${title}" by ${author}.`,
  )}`;

  return (
    <main className="flex-1 bg-[#0b1510] px-4 py-8 text-white sm:px-6 sm:py-12">
      <article className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.18fr)] md:gap-10 lg:gap-12">
        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-lg border border-white/10 shadow-xl shadow-black/20 md:max-w-none">
          <BookCover
            imageUrl={imageUrl}
            title={title}
            author={author}
            index={0}
            aspectClass="aspect-[3/4]"
          />
        </div>

        <div className="flex min-w-0 flex-col pt-1 md:pt-0">
          <p className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-emerald-200">
            {category}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/60 sm:text-base">by {author}</p>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/75 sm:text-base">
            {description}
          </p>

          <section
            aria-label="Book owner and availability"
            className="mt-6 grid gap-5 rounded-xl border border-white/5 bg-[#142019] p-4 sm:grid-cols-2 sm:p-5"
          >
            <div className="min-w-0">
              <p className="text-xs text-white/50">Added by</p>
              <p className="mt-1 truncate text-sm font-medium text-white/90">
                {ownerName}
              </p>
              {ownerEmail && (
                <p className="mt-1 truncate text-xs text-white/50">
                  {ownerEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/50">Copies left</p>
              <p className="mt-1 text-sm font-medium text-white/90">
                {Number.isFinite(copiesLeft) ? copiesLeft : "Not provided"}
              </p>
            </div>
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            {canRequestBook ? (
              <a
                href={borrowLink}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                Borrow This Book
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Borrow requests are not available for this book yet."
                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-md bg-emerald-300/50 px-4 py-2 text-sm font-semibold text-zinc-950/70"
              >
                Borrow This Book
              </button>
            )}
            <Link
              href="/all-books"
              className="text-sm text-white/65 transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
            >
              Back to all books
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
