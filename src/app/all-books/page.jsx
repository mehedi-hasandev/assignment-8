import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import BookCover from "@/components/book-cover";
import BookDetailsButton from "@/components/book-details-button";
import { sortBooksNewestFirst } from "@/lib/sort-books";
import { API_BASE_URL } from "@/lib/api-base-url";

const BOOKS_API_URL = `${API_BASE_URL}/books`;

function BookGridSkeleton() {
  return (
    <div
      aria-label="Loading books"
      aria-busy="true"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-brand-plum/20 bg-card"
        >
          <div className="aspect-[2/3] animate-pulse bg-slate-100 xl:aspect-[6/7]" />
          <div className="space-y-3 p-3">
            <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-8 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getBookId(book, index) {
  const id = book._id ?? book.id ?? book.bookId;

  if (id !== undefined && id !== null && String(id).trim()) {
    return String(id);
  }

  const title = book.bookTitle ?? book.title ?? "book";
  const slug = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "book"}-${index + 1}`;
}

function getBookList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.books)) {
    return payload.books;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("The books API returned an unexpected response.");
}

async function fetchBooks() {
  const response = await fetch(BOOKS_API_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "The books endpoint was not found. Check the backend route."
        : `The book server returned an error (${response.status}).`,
    );
  }

  return sortBooksNewestFirst(getBookList(await response.json()));
}

async function BookCatalog() {
  let books = [];
  let errorMessage = "";

  try {
    books = await fetchBooks();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load the books. Please try again.";
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-brand-plum/20 bg-brand-paper px-6 py-10 text-center"
      >
        <h2 className="font-semibold text-brand-ink">Unable to load books</h2>
        <p className="mt-2 text-sm text-brand-plum">{errorMessage}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-brand-plum/20 bg-card px-6 py-14 text-center">
        <h2 className="text-lg font-semibold">No books yet</h2>
        <p className="mt-2 text-sm text-slate-600">
          The library is waiting for its first book.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book, index) => {
        const title = String(book.bookTitle ?? book.title ?? "Untitled");
        const author = String(
          book.authorName ?? book.author ?? "Unknown author",
        );
        const category = String(book.category ?? "Uncategorized");
        const imageUrl = String(
          book.bookImage ?? book.imageUrl ?? book.coverImage ?? "",
        );
        const id = getBookId(book, index);

        return (
          <Card
            key={id}
            className="h-full gap-0 overflow-hidden rounded-lg border border-brand-plum/20 bg-card py-0 text-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-plum/40 hover:shadow-lg hover:shadow-black/20"
          >
            <BookCover
              imageUrl={imageUrl}
              title={title}
              author={author}
              index={index}
              aspectClass="aspect-[2/3] xl:aspect-[6/7]"
            />

            <CardHeader className="min-w-0 gap-2 px-4 pt-4 pb-1">
              <p className="truncate text-[10px] text-slate-600">{category}</p>
              <h2 className="truncate text-sm font-semibold" title={title}>
                {title}
              </h2>
              <p className="truncate text-xs text-slate-600" title={author}>
                by {author}
              </p>
            </CardHeader>

            <CardContent className="mt-auto px-4 pt-3 pb-4">
              <BookDetailsButton
                bookId={id}
                className="flex h-8 w-full items-center justify-center rounded-md bg-brand-cta px-3 text-xs font-medium text-white transition-colors hover:bg-brand-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cta"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AllBooksPage() {
  return (
    <main className="min-h-[70vh] flex-1 bg-background text-foreground">
      <header className="border-b border-brand-plum/20 bg-brand-paper px-4 py-4 text-center">
        <h1 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          All Books
        </h1>
        <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
          Every book on the BookNook shelf.
        </p>
      </header>

      <section
        aria-label="Book catalog"
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 xl:max-w-6xl"
      >
        <Suspense fallback={<BookGridSkeleton />}>
          <BookCatalog />
        </Suspense>
      </section>
    </main>
  );
}
