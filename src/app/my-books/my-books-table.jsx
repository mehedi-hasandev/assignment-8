"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/lib/auth-redirect";
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
  const router = useRouter();
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
        if (response.status === 401 || response.status === 403) {
          router.push(getLoginUrl("/my-books"));
          return;
        }
        throw new Error(result.message || "Could not update this book.");
      }

      setBooks((currentBooks) =>
        currentBooks.map((book, index) =>
          getBookId(book, index) === getBookId(editingBook, 0)
            ? {
                ...book,
                ...updates,
                bookTitle: updates.title,
                authorName: updates.author,
                bookImage: updates.imageUrl,
                shortDescription: updates.description,
              }
            : book,
        ),
      );
      setEditingBook(null);
      router.refresh();
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
        if (response.status === 401 || response.status === 403) {
          router.push(getLoginUrl("/my-books"));
          return;
        }
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
    "h-10 w-full min-w-0 rounded-md border border-[#781868]/20 bg-orange-50 px-3 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

  return (
    <>
      {books.length === 0 ? (
        <div className="rounded-xl border border-[#781868]/20 bg-white px-6 py-12 text-center">
          <BookOpen
            aria-hidden="true"
            size={28}
            className="mx-auto text-orange-800"
          />
          <h2 className="mt-4 text-lg font-semibold">No books added yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Books you add to the library will appear here.
          </p>
          <Link
            href="/add-books"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-300 px-4 py-2 text-sm font-medium text-[#201028] transition-colors hover:bg-emerald-400"
          >
            Add New Book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#781868]/20 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#781868]/20 bg-orange-50 text-xs text-slate-600">
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
              <tbody className="divide-y divide-orange-100">
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
                      className="text-sm text-slate-700 transition-colors hover:bg-orange-50/60"
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
                            <span className="flex h-[52px] w-10 items-center justify-center rounded-sm bg-orange-50 text-orange-800">
                              <BookOpen aria-hidden="true" size={18} />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-72 truncate font-medium text-slate-900">
                              {title}
                            </p>
                            <p className="max-w-72 truncate text-xs text-slate-500">
                              {String(book.authorName ?? book.author ?? "Unknown")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-2">
                        <span className="rounded bg-slate-50 px-2 py-1 text-xs">
                          {String(book.category ?? "Uncategorized")}
                        </span>
                      </td>
                      <td className="px-5 py-2 text-slate-600">
                        {String(book.totalCopies ?? 0)}
                      </td>
                      <td className="px-5 py-2 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            className="inline-flex items-center rounded-md border border-[#781868]/20 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <Pencil aria-hidden="true" size={13} className="mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(book, index)}
                            disabled={Boolean(deletingId)}
                            className="inline-flex items-center rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
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
        <DialogContent className="flex max-h-[85vh] max-h-[85dvh] w-full max-w-xl flex-col overflow-hidden border border-[#781868]/20 bg-white p-0 text-slate-900 sm:max-w-xl">
          <DialogHeader className="shrink-0 border-b border-[#781868]/20 bg-white p-4 pr-12 sm:p-6 sm:pr-14">
            <DialogTitle>Edit book</DialogTitle>
            <DialogDescription className="text-slate-600">
              Update the book details in your collection.
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <form
              onSubmit={handleEdit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 [scrollbar-width:thin]">
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Title</span>
                  <input
                    name="title"
                    defaultValue={
                      editingBook.title ?? editingBook.bookTitle ?? ""
                    }
                    className={fieldClassName}
                    required
                  />
                </label>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>Added by</span>
                    <input
                      value={userName}
                      className={fieldClassName}
                      readOnly
                    />
                  </label>
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>User email</span>
                    <input
                      type="email"
                      value={userEmail}
                      className={fieldClassName}
                      readOnly
                    />
                  </label>
                </div>
                <label className="block min-w-0 space-y-1.5 text-sm">
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
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <label className="block min-w-0 space-y-1.5 text-sm">
                    <span>Category</span>
                    <input
                      name="category"
                      defaultValue={editingBook.category ?? ""}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label className="block min-w-0 space-y-1.5 text-sm">
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
                {(editingBook.imageUrl ??
                  editingBook.bookImage ??
                  editingBook.bookImageUrl) && (
                  <div className="relative mx-auto aspect-[2/3] max-h-48 w-32 overflow-hidden rounded-lg border border-[#781868]/20 bg-orange-50">
                    <Image
                      src={
                        editingBook.imageUrl ??
                        editingBook.bookImage ??
                        editingBook.bookImageUrl
                      }
                      alt={`Cover of ${getTitle(editingBook)}`}
                      fill
                      unoptimized
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                )}
                <label className="block min-w-0 space-y-1.5 text-sm">
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
                <label className="block min-w-0 space-y-1.5 text-sm">
                  <span>Description</span>
                  <textarea
                    name="description"
                    defaultValue={
                      editingBook.description ??
                      editingBook.shortDescription ??
                      ""
                    }
                    maxLength={500}
                    className={`${fieldClassName} min-h-24 resize-y py-2`}
                  />
                </label>
              </div>
              <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-[#781868]/20 bg-white p-4">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={isSaving}
                  className="h-9 rounded-md border border-[#781868]/20 px-3 text-sm text-slate-900/75 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-emerald-300 px-3 text-sm font-medium text-[#201028] hover:bg-emerald-400 disabled:opacity-50"
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
