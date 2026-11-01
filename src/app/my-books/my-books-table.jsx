"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getBookId(book, index) {
  return String(book._id ?? book.id ?? book.bookId ?? `${book.title}-${index}`);
}

function getTitle(book) {
  return String(book.bookTitle ?? book.title ?? "Untitled");
}

export default function MyBooksTable({
  books: initialBooks,
  userName,
  userEmail,
}) {
  const [books, setBooks] = useState(initialBooks);
  const [editingBook, setEditingBook] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function handleEdit(event) {
    event.preventDefault();
    if (!editingBook) return;

    const formData = new FormData(event.currentTarget);
    const updates = {
      title: String(formData.get("title") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      totalCopies: Number(formData.get("totalCopies")),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
    };

    if (!updates.title || !updates.author || !updates.category) {
      toast.error("Title, author, and category are required.");
      return;
    }

    if (!Number.isInteger(updates.totalCopies) || updates.totalCopies < 1) {
      toast.error("Total copies must be a whole number greater than zero.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/books/${encodeURIComponent(getBookId(editingBook, 0))}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update this book.");
      }

      setBooks((currentBooks) =>
        currentBooks.map((book, index) =>
          getBookId(book, index) === getBookId(editingBook, 0)
            ? { ...book, ...result.book }
            : book,
        ),
      );
      setEditingBook(null);
      toast.success("Book updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update this book.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(book, index) {
    const id = getBookId(book, index);
    const title = getTitle(book);
    if (!window.confirm(`Delete "${title}" from your books?`)) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/books/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete this book.");
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item, itemIndex) => getBookId(item, itemIndex) !== id),
      );
      toast.success("Book deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete this book.",
      );
    } finally {
      setDeletingId("");
    }
  }

  const fieldClassName =
    "h-10 w-full rounded-md border border-white/10 bg-zinc-950/60 px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

  return (
    <>
      {books.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#111d17] px-6 py-12 text-center">
          <BookOpen
            aria-hidden="true"
            size={28}
            className="mx-auto text-emerald-200"
          />
          <h2 className="mt-4 text-lg font-semibold">No books added yet</h2>
          <p className="mt-2 text-sm text-white/55">
            Books you add to the library will appear here.
          </p>
          <Link
            href="/add-books"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111d17]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-xs text-white/65">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Book
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Copies
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {books.map((book, index) => {
                  const title = getTitle(book);
                  const image = String(
                    book.bookImage ??
                      book.imageUrl ??
                      book.bookImageUrl ??
                      book.coverImage ??
                      "",
                  );
                  const id = getBookId(book, index);

                  return (
                    <tr
                      key={id}
                      className="text-sm text-white/80 transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-2">
                        <div className="flex items-center gap-3">
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
                            <span className="flex h-[52px] w-10 items-center justify-center rounded-sm bg-emerald-950 text-emerald-200">
                              <BookOpen aria-hidden="true" size={18} />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-72 truncate font-medium text-white">
                              {title}
                            </p>
                            <p className="max-w-72 truncate text-xs text-white/50">
                              {String(book.authorName ?? book.author ?? "Unknown")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-2">
                        <span className="rounded bg-white/5 px-2 py-1 text-xs">
                          {String(book.category ?? "Uncategorized")}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-white/70">
                        {String(book.totalCopies ?? 0)}
                      </td>
                      <td className="px-5 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10"
                          >
                            <Pencil aria-hidden="true" size={13} className="mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(book, index)}
                            disabled={Boolean(deletingId)}
                            className="inline-flex items-center rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === id ? (
                              <LoaderCircle
                                aria-hidden="true"
                                size={13}
                                className="mr-1 animate-spin"
                              />
                            ) : (
                              <Trash2
                                aria-hidden="true"
                                size={13}
                                className="mr-1"
                              />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(editingBook)}
        onOpenChange={(open) => {
          if (!open && !isSaving) setEditingBook(null);
        }}
      >
        <DialogContent className="border border-white/10 bg-[#111d17] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit book</DialogTitle>
            <DialogDescription className="text-white/55">
              Update the book details in your collection.
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <form onSubmit={handleEdit} className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span>Title</span>
                <input
                  name="title"
                  defaultValue={editingBook.title ?? editingBook.bookTitle ?? ""}
                  className={fieldClassName}
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm">
                  <span>Added by</span>
                  <input
                    value={userName}
                    className={fieldClassName}
                    readOnly
                  />
                </label>
                <label className="block space-y-1.5 text-sm">
                  <span>User email</span>
                  <input
                    type="email"
                    value={userEmail}
                    className={fieldClassName}
                    readOnly
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-sm">
                <span>Author</span>
                <input
                  name="author"
                  defaultValue={
                    editingBook.author ?? editingBook.authorName ?? ""
                  }
                  className={fieldClassName}
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm">
                  <span>Category</span>
                  <input
                    name="category"
                    defaultValue={editingBook.category ?? ""}
                    className={fieldClassName}
                    required
                  />
                </label>
                <label className="block space-y-1.5 text-sm">
                  <span>Total copies</span>
                  <input
                    name="totalCopies"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={editingBook.totalCopies ?? 1}
                    className={fieldClassName}
                    required
                  />
                </label>
              </div>
              <label className="block space-y-1.5 text-sm">
                <span>Cover image URL</span>
                <input
                  name="imageUrl"
                  type="url"
                  defaultValue={
                    editingBook.imageUrl ??
                    editingBook.bookImage ??
                    editingBook.bookImageUrl ??
                    ""
                  }
                  className={fieldClassName}
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span>Description</span>
                <textarea
                  name="description"
                  defaultValue={editingBook.description ?? ""}
                  maxLength={500}
                  className={`${fieldClassName} min-h-24 resize-y py-2`}
                />
              </label>
              <DialogFooter className="border-white/10 bg-transparent p-0">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isSaving}
                  className="h-9 rounded-md border border-white/10 px-3 text-sm text-white/75 hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-emerald-300 px-3 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isSaving && (
                    <LoaderCircle
                      aria-hidden="true"
                      size={15}
                      className="animate-spin"
                    />
                  )}
                  Save changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
