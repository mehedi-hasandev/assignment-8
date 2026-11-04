"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth-client";
import { getLoginUrl } from "@/lib/auth-redirect";

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

const MAX_COVER_SIZE = 64 * 1024;
const MAX_IMAGE_DIMENSION = 1200;

async function compressCoverImage(file) {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please choose an image file."));
  }

  if (file.size > 10 * 1024 * 1024) {
    return Promise.reject(new Error("Choose an image smaller than 10 MB."));
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not process this image. Please try another.");
    }

    context.fillStyle = "#ffffff";
    const maxDimension = Math.max(bitmap.width, bitmap.height);

    for (const scale of [1, 0.75, 0.5, 0.35]) {
      const dimensionScale = Math.min(1, MAX_IMAGE_DIMENSION / maxDimension) * scale;
      canvas.width = Math.max(1, Math.round(bitmap.width * dimensionScale));
      canvas.height = Math.max(1, Math.round(bitmap.height * dimensionScale));
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.8, 0.65, 0.5]) {
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality),
        );

        if (!blob) {
          throw new Error("Could not process this image. Please try another.");
        }

        if (blob.size <= MAX_COVER_SIZE) {
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () =>
              reject(new Error("Could not read the selected image."));
            reader.readAsDataURL(blob);
          });
        }
      }
    }

    throw new Error(
      "This image could not be compressed enough. Please choose a smaller image.",
    );
  } finally {
    bitmap.close();
  }
}

export default function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [category, setCategory] = useState("");
  const [imageSource, setImageSource] = useState("url");
  const [uploadedImage, setUploadedImage] = useState("");
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleImageChange(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    setUploadedImage("");
    setMessage(null);

    if (!file) return;

    setIsPreparingImage(true);
    try {
      setUploadedImage(await compressCoverImage(file));
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not process the selected image.",
      });
      input.value = "";
    } finally {
      setIsPreparingImage(false);
    }
  }

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
      imageUrl:
        imageSource === "device"
          ? uploadedImage
          : String(formData.get("imageUrl") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
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
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      if (response.status === 401 || response.status === 403) {
        router.push(getLoginUrl("/add-books"));
        return;
      }

      if (!response.ok) {
        let result;
        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (response.status === 404) {
          throw new Error(
            "The book endpoint was not found. Check the backend route at http://localhost:8000/add-books.",
          );
        }

        throw new Error(
          result?.message || "We couldn't add this book. Please try again.",
        );
      }

      form.reset();
      setCategory("");
      setImageSource("url");
      setUploadedImage("");
      toast.success("Your book was added successfully.");
      router.refresh();
      router.push("/my-books");
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
    "h-11 border-[#781868]/20 bg-orange-50 text-foreground placeholder:text-slate-400";

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
          className="rounded-2xl border border-[#781868]/20 bg-white p-5 shadow-xl shadow-black/10 sm:p-8"
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
                  className="h-11 w-full border-[#781868]/20 bg-orange-50 text-foreground"
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
              <label htmlFor="imageSource" className="text-sm font-medium">
                Book Cover{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Select
                value={imageSource}
                onValueChange={(value) => {
                  setImageSource(value ?? "url");
                  setUploadedImage("");
                  setMessage(null);
                }}
              >
                <SelectTrigger
                  id="imageSource"
                  className="h-11 w-full border-[#781868]/20 bg-orange-50 text-foreground"
                  aria-label="Book cover source"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Use image URL</SelectItem>
                  <SelectItem value="device">Upload from device</SelectItem>
                </SelectContent>
              </Select>

              {imageSource === "url" ? (
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className={fieldClassName}
                  placeholder="https://example.com/book-cover.jpg"
                />
              ) : (
                <div className="space-y-3">
                  <Input
                    id="coverFile"
                    name="coverFile"
                    type="file"
                    accept="image/*"
                    className={`${fieldClassName} h-auto min-h-11 cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-[#41283d] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white`}
                    onChange={handleImageChange}
                    aria-label="Choose a book cover image"
                  />
                  {isPreparingImage && (
                    <p role="status" className="text-sm text-muted-foreground">
                      Preparing image…
                    </p>
                  )}
                  {uploadedImage && (
                    <div className="relative h-40 w-28 overflow-hidden rounded-md border border-[#781868]/20">
                      <Image
                        src={uploadedImage}
                        alt="Selected book cover preview"
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short Description
              </label>
              <Textarea
                id="description"
                name="description"
                className="min-h-28 resize-y border-[#781868]/20 bg-orange-50 text-foreground placeholder:text-slate-400"
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
                value={session?.user?.name ?? ""}
                className="h-11 border-[#781868]/20 bg-orange-50 text-muted-foreground"
                placeholder="Your account name"
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
                value={session?.user?.email ?? ""}
                className="h-11 border-[#781868]/20 bg-orange-50 text-muted-foreground"
                placeholder="Your account email"
                readOnly
              />
            </div>
          </div>

          {message && (
            <p
              role={message.type === "error" ? "alert" : "status"}
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                "border-red-500/30 bg-red-500/10 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isPreparingImage}
            className="mt-6 h-11 w-full bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
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
