"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Mystery",
  "Biography",
  "Poetry",
  "Other",
];

const API_URL = "http://localhost:8000/add-books";

export default function AddBookPage() {
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);

    if (!category) {
      setMessage({ type: "error", text: "Please choose a book category." });
      return;
    }

    const formData = new FormData(form);
    const book = {
      title: String(formData.get("title") ?? "").trim(),
      author: String(formData.get("author") ?? "").trim(),
      category,
      totalCopies: Number(formData.get("totalCopies")),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      userName: String(formData.get("userName") ?? ""),
      userEmail: String(formData.get("userEmail") ?? ""),
    };

    if (!book.title || !book.author || !book.description) {
      setMessage({
        type: "error",
        text: "Please fill in the title, author, and description.",
      });
      return;
    }

    if (!Number.isInteger(book.totalCopies) || book.totalCopies < 1) {
      setMessage({
        type: "error",
        text: "Total copies must be a whole number greater than zero.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "The book endpoint was not found. Check the backend route at http://localhost:8000/add-books.",
          );
        }

        throw new Error("We couldn't add this book. Please try again.");
      }

      form.reset();
      setCategory("");
      setMessage({ type: "success", text: "Your book was added successfully." });
    } catch (error) {
      let errorText = "Something went wrong. Please try again.";

      if (error instanceof TypeError) {
        errorText =
          "Could not connect to the book server. Make sure it is running and try again.";
      } else if (error instanceof Error) {
        errorText = error.message;
      }

      setMessage({
        type: "error",
        text: errorText,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "h-11 border-white/10 bg-zinc-950/60 text-foreground placeholder:text-zinc-500";

  return (
    <main className="flex-1 bg-background px-4 py-12 text-foreground sm:px-6 sm:py-16">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Add a Book
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Put a book from your shelf into the library.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/10 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Book Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                className={fieldClassName}
                placeholder="e.g. The Midnight Library"
                autoComplete="off"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium">
                Author Name
              </label>
              <Input
                id="author"
                name="author"
                type="text"
                className={fieldClassName}
                placeholder="e.g. Matt Haig"
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "")}
              >
                <SelectTrigger
                  id="category"
                  className="h-11 w-full border-white/10 bg-zinc-950/60 text-foreground"
                  aria-label="Category"
                  aria-required="true"
                >
                  <SelectValue className="" placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="">
                  {categories.map((item) => (
                    <SelectItem key={item} value={item} className="">
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="totalCopies" className="text-sm font-medium">
                Total Copies
              </label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                step={1}
                defaultValue={1}
                className={fieldClassName}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                Book Image URL{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className={fieldClassName}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short Description
              </label>
              <Textarea
                id="description"
                name="description"
                className="min-h-28 resize-y border-white/10 bg-zinc-950/60 text-foreground placeholder:text-zinc-500"
                placeholder="What should other readers know about this book?"
                maxLength={500}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium">
                User Name
              </label>
              <Input
                id="userName"
                name="userName"
                type="text"
                className="h-11 border-white/10 bg-zinc-900 text-muted-foreground"
                placeholder="Connect your account to load your name"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="userEmail" className="text-sm font-medium">
                User Email
              </label>
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                className="h-11 border-white/10 bg-zinc-900 text-muted-foreground"
                placeholder="Connect your account to load your email"
                readOnly
              />
            </div>
          </div>

          {message && (
            <p
              role={message.type === "error" ? "alert" : "status"}
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                message.type === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full bg-emerald-500 font-semibold text-zinc-950 hover:bg-emerald-600"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Adding book...
              </>
            ) : (
              "Add Book"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
