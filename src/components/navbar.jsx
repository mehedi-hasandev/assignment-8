"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
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
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-books" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;
  const visibleNavigation = user ? navigation : navigation.slice(0, 2);
  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

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
    <header className="sticky top-0 z-30 w-full border-b border-[#781868]/20 bg-white/95 text-slate-900 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="BookNook home"
        >
          <Image
            src="/site%20logo.png"
            alt="BookNook"
            width={152}
            height={42}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {visibleNavigation.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`text-xs transition-colors hover:text-emerald-300 ${
                isActive(href) ? "font-medium text-emerald-300" : "text-slate-600"
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
              className="size-9 animate-pulse rounded-full bg-slate-100"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Open ${userName}'s user menu`}
                className="rounded-full outline-none ring-emerald-300 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Avatar className="size-9 border border-orange-200 bg-[#201028] ring-2 ring-emerald-300/25">
                  <AvatarImage src={user.image || undefined} alt={userName} />
                  <AvatarFallback className="bg-[#201028] font-semibold text-white">
                    {userName.charAt(0).toUpperCase() || <UserRound size={17} />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium text-slate-900">
                    {userName}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-600">
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
                  className="text-red-700 focus:bg-red-400/10 focus:text-red-700"
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
                className="rounded-md px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-400"
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
        {visibleNavigation.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`shrink-0 text-[11px] transition-colors hover:text-emerald-300 ${
              isActive(href) ? "font-medium text-emerald-300" : "text-slate-600"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
