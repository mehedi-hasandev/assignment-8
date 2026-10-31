import Link from "next/link";
import { BookOpen } from "lucide-react";

const navigation = [
  { label: "Home", href: "/", active: true },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/books/add" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#101812]/95 text-white shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="BookNook home"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-[#101812]">
            <BookOpen aria-hidden="true" size={17} strokeWidth={2.2} />
          </span>
          <span className="text-sm font-semibold tracking-tight">BookNook</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {navigation.map(({ label, href, active }) => (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`text-xs transition-colors hover:text-emerald-300 ${
                active ? "font-medium text-emerald-300" : "text-white/70"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-[#101812] transition-colors hover:bg-emerald-400"
          >
            Register
          </Link>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex items-center justify-center gap-5 overflow-x-auto px-4 pb-2 md:hidden"
      >
        {navigation.map(({ label, href, active }) => (
          <Link
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 text-[11px] transition-colors hover:text-emerald-300 ${
              active ? "font-medium text-emerald-300" : "text-white/70"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
