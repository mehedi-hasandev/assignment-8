import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import BookCover from "@/components/book-cover";
import BookBorrowDialog from "@/components/book-borrow-dialog";
import { createBackendAccessToken } from "@/lib/createBackendAccessToken";

const BOOKS_API_URL =
  process.env.BOOKS_API_URL || "http://localhost:8000/books";

async function getBook(id, token) {
  let response;

  try {
    response = await fetch(`${BOOKS_API_URL}/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
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
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });
    const token = session ? createBackendAccessToken(session.user) : null;
    book = await getBook(id, token);
  } catch (problem) {
    error =
      problem instanceof Error
        ? problem.message
        : "Could not load this book. Please try again.";
  }

  if (!book && !error) notFound();

  if (error) {
    return (
      <main className="flex-1 bg-background px-4 py-16 text-foreground sm:px-6">
        <section
          role="alert"
          className="mx-auto max-w-2xl rounded-xl border border-brand-plum/20 bg-brand-paper p-6 text-center sm:p-8"
        >
          <h1 className="text-xl font-semibold text-brand-ink">
            Book details unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-brand-plum">{error}</p>
          <Link
            href="/all-books"
            className="mt-6 inline-flex rounded-md bg-brand-cta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-cta-hover"
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

  return (
    <main className="w-full flex-1 bg-background py-8 text-foreground sm:py-12">
      <article className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-8 px-4 md:grid-cols-2 md:gap-10">
        <div className="@container relative mx-auto w-full max-w-[52.5vh] overflow-hidden rounded-xl border border-brand-plum/20 shadow-xl shadow-black/10">
          <BookCover
            imageUrl={imageUrl}
            title={title}
            author={author}
            index={0}
            aspectClass="h-[min(70vh,133.333cqi)] w-full"
          />
        </div>

        <div className="flex min-w-0 flex-col pt-1 md:pt-0">
          <p className="w-fit rounded-full border border-brand-plum/20 bg-brand-paper px-3 py-1 text-xs font-medium text-brand-ink">
            {category}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">by {author}</p>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-900/75 sm:text-base">
            {description}
          </p>

          <BookBorrowDialog
            bookId={id}
            bookTitle={title}
            bookImage={imageUrl}
            authorName={author}
            category={category}
            ownerName={ownerName}
            ownerEmail={ownerEmail}
            initialCopies={copiesLeft}
          />
        </div>
      </article>
    </main>
  );
}