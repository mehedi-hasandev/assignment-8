import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import BorrowList from "@/app/my-borrows/borrow-list";
import { auth } from "@/lib/auth";
import { getLoginUrl } from "@/lib/auth-redirect";
import { createBackendAccessToken } from "@/lib/createBackendAccessToken";
import { API_BASE_URL } from "@/lib/api-base-url";

const BORROWS_API_URL = `${API_BASE_URL}/borrows`;

export const dynamic = "force-dynamic";

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

async function getMyBorrows(user, token) {
  const url = new URL(BORROWS_API_URL);
  url.searchParams.set("email", user.email);
  let response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
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

  const normalizedEmail = user.email.trim().toLowerCase();

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

export default async function MyBorrowsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session) {
    redirect(getLoginUrl("/my-borrows"));
  }

  const user = session.user;
  let borrows = [];
  let errorMessage = "";

  try {
    const token = createBackendAccessToken(user);
    borrows = await getMyBorrows(user, token);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "We couldn't load your borrowed books. Please try again.";
  }

  return (
    <main className="min-h-[70vh] w-full flex-1 bg-background text-foreground">
      <header className="border-b border-brand-plum/20 bg-brand-paper px-4 py-8 text-center sm:py-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          My Borrows
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you are reading right now.
        </p>
      </header>

      <section
        aria-label="Your borrowed books"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
      >
        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-brand-plum/20 bg-brand-paper px-6 py-8 text-center"
          >
            <h2 className="font-semibold text-brand-ink">
              Unable to load your borrows
            </h2>
            <p className="mt-2 text-sm text-brand-plum">{errorMessage}</p>
          </div>
        ) : borrows.length > 0 ? (
          <BorrowList borrows={borrows} />
        ) : (
          <div className="rounded-xl border border-brand-plum/20 bg-card px-6 py-12 text-center">
            <BookOpen
              aria-hidden="true"
              size={28}
              className="mx-auto text-brand-plum"
            />
            <h2 className="mt-4 text-lg font-semibold">
              You haven&apos;t borrowed any books yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the library and find your next read.
            </p>
            <Link
              href="/all-books"
              className="mt-5 inline-flex rounded-md bg-brand-cta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-cta-hover"
            >
              Browse Books
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
