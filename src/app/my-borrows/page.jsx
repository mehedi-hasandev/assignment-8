import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { requireUser } from "@/lib/require-user";

const BORROWS_API_URL = "http://localhost:8000/borrows";

function getBorrowList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.borrows)) {
    return payload.borrows;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("The borrows API returned an unexpected response.");
}

async function getMyBorrows(email) {
  let response;

  try {
    response = await fetch(BORROWS_API_URL, { cache: "no-store" });
  } catch {
    throw new Error(
      "Could not connect to the borrow server. Make sure it is running and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "The borrows endpoint was not found. Check the backend route."
        : `The borrow server returned an error (${response.status}).`,
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The borrow server returned invalid data.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  return getBorrowList(payload).filter((borrow) => {
    if (!borrow || typeof borrow !== "object") {
      return false;
    }

    const borrowerEmail = borrow.userEmail ?? borrow.email ?? "";
    return (
      typeof borrowerEmail === "string" &&
      borrowerEmail.trim().toLowerCase() === normalizedEmail
    );
  });
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getBookTitle(borrow) {
  return String(borrow.bookTitle ?? borrow.title ?? "Untitled");
}

function getBookImage(borrow) {
  const image =
    borrow.bookImage ?? borrow.imageUrl ?? borrow.bookImageUrl ?? "";
  return typeof image === "string" ? image : "";
}

function getBorrowId(borrow, index) {
  const id = borrow._id ?? borrow.id ?? borrow.borrowId;
  return id === undefined || id === null
    ? `${getBookTitle(borrow)}-${index}`
    : String(id);
}

function BorrowRows({ borrows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-xs text-white/65">
            <th scope="col" className="px-4 py-3 font-medium">
              Image
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Title
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Borrow Date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Return Date
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {borrows.map((borrow, index) => {
            const title = getBookTitle(borrow);
            const image = getBookImage(borrow);
            const borrowDate =
              borrow.borrowDate ?? borrow.borrowedAt ?? borrow.createdAt;

            return (
              <tr
                key={getBorrowId(borrow, index)}
                className="text-sm text-white/80 transition-colors hover:bg-white/[0.025]"
              >
                <td className="px-4 py-2">
                  {image ? (
                    <Image
                      src={image}
                      alt={`Cover of ${title}`}
                      width={40}
                      height={52}
                      unoptimized
                      className="h-[52px] w-10 rounded-sm object-cover"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`No cover available for ${title}`}
                      className="flex h-[52px] w-10 items-center justify-center rounded-sm bg-emerald-950 text-emerald-200"
                    >
                      <BookOpen aria-hidden="true" size={18} />
                    </div>
                  )}
                </td>
                <td className="max-w-64 truncate px-4 py-2 font-medium text-white">
                  {title}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs text-white/70">
                  {formatDate(borrowDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-xs text-white/70">
                  {formatDate(borrow.returnDate)}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    disabled
                    title="Returning books is not available yet."
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50"
                  >
                    Return Book
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function MyBorrowsPage() {
  const user = await requireUser("/my-borrows");
  let borrows = [];
  let errorMessage = "";

  try {
    borrows = await getMyBorrows(user.email);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load your borrowed books. Please try again.";
  }

  return (
    <main className="min-h-[70vh] flex-1 bg-[#0b1510] text-white">
      <header className="border-b border-white/10 bg-[#17241d] px-4 py-8 text-center sm:py-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Books you are reading right now.
        </p>
      </header>

      <section
        aria-label="Your borrowed books"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
      >
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-950/30 px-6 py-8 text-center"
          >
            <h2 className="font-semibold text-red-200">
              Unable to load your borrows
            </h2>
            <p className="mt-2 text-sm text-red-100/70">{errorMessage}</p>
          </div>
        ) : borrows.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#111d17]">
            <BorrowRows borrows={borrows} />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#111d17] px-6 py-12 text-center">
            <BookOpen
              aria-hidden="true"
              size={28}
              className="mx-auto text-emerald-200"
            />
            <h2 className="mt-4 text-lg font-semibold">
              You haven&apos;t borrowed any books yet
            </h2>
            <p className="mt-2 text-sm text-white/55">
              Browse the library and find your next read.
            </p>
            <Link
              href="/all-books"
              className="mt-5 inline-flex rounded-md bg-emerald-300 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              Browse Books
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
