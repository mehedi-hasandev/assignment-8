"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/", active: true },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-books" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;
  const visibleNavigation = user ? navigation : navigation.slice(0, 2);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("You are logged out.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not log out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  const userName = user?.name || "BookNook member";

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
          {visibleNavigation.map(({ label, href, active }) => (
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
          {isPending ? (
            <span
              aria-hidden="true"
              className="size-9 animate-pulse rounded-full bg-white/10"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open ${userName}'s user menu`}
                className="rounded-full outline-none ring-emerald-300 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101812]"
              >
                <Avatar className="size-9 border border-white/15 ring-2 ring-emerald-300/15">
                  <AvatarImage src={user.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-emerald-300/15 font-semibold text-emerald-100">
                    {userName.charAt(0).toUpperCase() || <UserRound size={17} />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium text-white">
                    {userName}
                  </p>
                  <p className="mt-1 truncate text-xs text-white/55">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/my-profile" />}
                >
                  <UserRound aria-hidden="true" size={16} />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-red-400 focus:bg-red-400/10 focus:text-red-300"
                >
                  <LogOut aria-hidden="true" size={16} />
                  {isSigningOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex items-center justify-center gap-5 overflow-x-auto px-4 pb-2 md:hidden"
      >
        {visibleNavigation.map(({ label, href, active }) => (
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
