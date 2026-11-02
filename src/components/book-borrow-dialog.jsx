"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getLoginUrl } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookBorrowDialog({
  bookId,
  bookTitle,
  bookImage,
  authorName,
  category,
  ownerName,
  ownerEmail,
  initialCopies,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [isCheckingBorrowStatus, setIsCheckingBorrowStatus] = useState(true);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [borrowStatusError, setBorrowStatusError] = useState("");
  const [copiesLeft, setCopiesLeft] = useState(initialCopies);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function checkBorrowStatus() {
      if (isSessionPending) {
        return;
      }

      if (!session?.user?.email) {
        setAlreadyBorrowed(false);
        setBorrowStatusError("");
        setIsCheckingBorrowStatus(false);
        return;
      }

      setIsCheckingBorrowStatus(true);

      try {
        const response = await fetch(
          `/api/borrows?bookId=${encodeURIComponent(bookId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Could not check your borrow status.",
          );
        }

        if (isCurrent) {
          setAlreadyBorrowed(Boolean(result.alreadyBorrowed));
          if (Number.isFinite(result.availableCopies)) {
            setCopiesLeft(result.availableCopies);
          }
          setBorrowStatusError("");
        }
      } catch (error) {
        if (isCurrent) {
          setBorrowStatusError(
            error instanceof Error
              ? error.message
              : "Could not check your borrow status.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsCheckingBorrowStatus(false);
        }
      }
    }

    function checkWhenVisible() {
      if (document.visibilityState === "visible") {
        checkBorrowStatus();
      }
    }

    checkBorrowStatus();
    window.addEventListener("focus", checkBorrowStatus);
    window.addEventListener("pageshow", checkBorrowStatus);
    window.addEventListener("popstate", checkBorrowStatus);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      isCurrent = false;
      window.removeEventListener("focus", checkBorrowStatus);
      window.removeEventListener("pageshow", checkBorrowStatus);
      window.removeEventListener("popstate", checkBorrowStatus);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [bookId, isSessionPending, session?.user?.email]);

  const isOutOfStock = !Number.isFinite(copiesLeft) || copiesLeft <= 0;

  async function handleBorrowClick() {
    setIsCheckingSession(true);

    try {
      const { data: session, error } = await authClient.getSession();

      if (error) {
        throw new Error(error.message);
      }

      if (!session?.user) {
        router.push(getLoginUrl(pathname));
        return;
      }

      const statusResponse = await fetch(
        `/api/borrows?bookId=${encodeURIComponent(bookId)}`,
        { cache: "no-store" },
      );
      const statusResult = await statusResponse.json();

      if (!statusResponse.ok) {
        throw new Error(
          statusResult.message || "Could not check your borrow status.",
        );
      }

      if (statusResult.alreadyBorrowed) {
        setAlreadyBorrowed(true);
        toast.error("You have already borrowed this book.");
        return;
      }

      setAlreadyBorrowed(false);
      if (Number.isFinite(statusResult.availableCopies)) {
        setCopiesLeft(statusResult.availableCopies);
      }
      setBorrowStatusError("");

      if (
        Number.isFinite(statusResult.availableCopies) &&
        statusResult.availableCopies <= 0
      ) {
        setCopiesLeft(0);
        toast.error("This book is out of stock.");
        return;
      }

      setUserName(session.user.name || "");
      setUserEmail(session.user.email || "");
      setIsOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not verify your login. Please try again.",
      );
    } finally {
      setIsCheckingSession(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!userName.trim() || !userEmail.trim()) {
      toast.error("Enter your name and email.");
      return;
    }

    if (!userEmail.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (copiesLeft < 1) {
      setIsOpen(false);
      toast.error("No copies are currently available.");
      return;
    }

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + 7);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          bookTitle,
          bookImage,
          authorName,
          category,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          borrowDate: borrowDate.toISOString(),
          returnDate: returnDate.toISOString(),
        }),
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        result = { message: responseText };
      }

      if (response.status === 401) {
        router.push(getLoginUrl(pathname));
        return;
      }

      if (!response.ok) {
        if (response.status === 400 && /already borrowed/i.test(result.message)) {
          setAlreadyBorrowed(true);
          setIsOpen(false);
        }

        if (response.status === 409) {
          setCopiesLeft(0);
        }

        throw new Error(
          result?.message || result?.error || "Could not borrow this book.",
        );
      }

      setCopiesLeft((currentCopies) => currentCopies - 1);
      setAlreadyBorrowed(true);
      setIsOpen(false);
      setUserName("");
      setUserEmail("");
      toast.success("Book borrowed successfully. Return it within 7 days.");
    } catch (error) {
      toast.error(
        error instanceof TypeError
          ? "Could not connect to the book server. Please try again."
          : error instanceof Error
            ? error.message
            : "Could not borrow this book. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
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
            <p className="mt-1 truncate text-xs text-white/50">{ownerEmail}</p>
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button
            type="button"
            onClick={handleBorrowClick}
            disabled={
              isSessionPending ||
              isCheckingBorrowStatus ||
              isCheckingSession ||
              alreadyBorrowed ||
              isOutOfStock
            }
            className="bg-emerald-300 px-4 text-zinc-950 hover:bg-emerald-400"
          >
            {isCheckingBorrowStatus
              ? "Checking availability..."
              : alreadyBorrowed
                ? "Already Borrowed"
                : isOutOfStock
                  ? "Not Available"
                  : isCheckingSession
                    ? "Checking..."
                    : "Borrow This Book"}
          </Button>
          <DialogContent className="rounded-2xl border border-white/10 bg-[#111d17] p-5 text-white sm:max-w-md">
            <DialogHeader className="pr-8">
              <DialogTitle className="font-serif text-lg font-semibold">
                Borrow &quot;{bookTitle}&quot;
              </DialogTitle>
              <DialogDescription className="text-white/55">
                You can keep this book for 7 days.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="borrower-name" className="text-sm font-medium">
                  User Name
                </label>
                <Input
                  id="borrower-name"
                  autoComplete="name"
                  value={userName}
                  readOnly
                  required
                  disabled={isSubmitting}
                  className="h-10 cursor-default border-white/10 bg-[#18251e] text-white read-only:focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="borrower-email" className="text-sm font-medium">
                  User Email
                </label>
                <Input
                  id="borrower-email"
                  type="email"
                  autoComplete="email"
                  value={userEmail}
                  readOnly
                  required
                  disabled={isSubmitting}
                  className="h-10 cursor-default border-white/10 bg-[#18251e] text-white read-only:focus-visible:ring-0"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting || isOutOfStock || alreadyBorrowed}
                  className="h-10 rounded-lg bg-emerald-300 px-4 font-medium text-zinc-950 hover:bg-emerald-400"
                >
                  {isSubmitting && (
                    <LoaderCircle
                      aria-hidden="true"
                      className="animate-spin"
                    />
                  )}
                  {isSubmitting ? "Submitting..." : "Confirm Borrow"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {borrowStatusError && (
          <p role="alert" className="text-sm text-red-300">
            {borrowStatusError}
          </p>
        )}

        <Link
          href="/all-books"
          className="text-sm text-white/65 transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
        >
          Back to all books
        </Link>
      </div>

    </>
  );
}
