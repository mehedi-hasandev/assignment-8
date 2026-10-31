import Link from "next/link";
import { AtSign, BookOpen, Mail } from "lucide-react";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.5 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM5 10h3v9H5v-9Zm5 0h2.9v1.2h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.6 2 3.6 4.5V19h-3v-4.3c0-1 0-2.3-1.5-2.3s-1.8 1.1-1.8 2.2V19h-3v-9Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#101812] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-14">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="BookNook home"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-[#101812]">
              <BookOpen aria-hidden="true" size={19} strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold tracking-tight">
              BookNook
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            A neighborhood book-sharing community bringing readers and the
            stories they love a little closer together.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <a
            href="mailto:hello@booknook.com"
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-emerald-300"
          >
            <Mail aria-hidden="true" size={16} />
            hello@booknook.com
          </a>
          <a
            href="mailto:hello@booknook.com"
            className="mt-3 flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-emerald-300"
          >
            <AtSign aria-hidden="true" size={16} />
            Send us a message
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Follow BookNook</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                <span className="size-[18px]">{icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          © 2026 BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
