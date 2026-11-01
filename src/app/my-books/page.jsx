import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyBooksPage() {
  return (
    <main className="min-h-[70vh] flex-1 bg-[#0b1510] text-white">
      <header className="border-b border-white/10 bg-[#17241d] px-4 py-8 text-center sm:py-10">
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          My Books
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Books you added to the library.
        </p>
      </header>

      <section
        aria-label="Your books"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111d17]">
          <div className="hidden grid-cols-[minmax(240px,1fr)_minmax(120px,0.3fr)_minmax(90px,0.2fr)_140px] items-center gap-4 border-b border-white/10 px-5 py-3 text-xs font-medium text-white/65 sm:grid">
            <span>Book</span>
            <span>Category</span>
            <span>Copies</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="flex flex-col items-center px-5 py-14 text-center sm:py-16">
            <span className="flex size-12 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/10 text-emerald-200">
              <BookOpen aria-hidden="true" size={22} />
            </span>
            <h2 className="mt-5 text-lg font-semibold">No books added yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
              Books you add to the library will appear here, where you can
              manage your collection.
            </p>
            <Button
              asChild
              className="mt-6 bg-emerald-300 text-zinc-950 hover:bg-emerald-400"
            >
              <Link href="/add-books">
                <Plus aria-hidden="true" />
                Add New Book
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
