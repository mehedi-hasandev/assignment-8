"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BORROWS_API_URL = "http://localhost:8000/borrows";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiesLeft, setCopiesLeft] = useState(initialCopies);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

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

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);

    setIsSubmitting(true);

    try {
      const response = await fetch(BORROWS_API_URL, {
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

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Could not borrow this book.",
        );
      }

      setCopiesLeft((currentCopies) => currentCopies - 1);
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
          <DialogTrigger
            render={
              <Button
                type="button"
                disabled={!Number.isFinite(copiesLeft) || copiesLeft < 1}
                className="bg-emerald-300 px-4 text-zinc-950 hover:bg-emerald-400"
              />
            }
          >
            Borrow This Book
          </DialogTrigger>
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
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                  className="h-10 border-white/10 bg-[#18251e] text-white placeholder:text-white/35"
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
                  onChange={(event) => setUserEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="h-10 border-white/10 bg-[#18251e] text-white placeholder:text-white/35"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting || copiesLeft < 1}
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
