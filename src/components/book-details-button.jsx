"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getLoginUrl } from "@/lib/auth-redirect";

export default function BookDetailsButton({ bookId, className }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const detailsUrl = `/all-books/${encodeURIComponent(bookId)}`;

  function handleClick() {
    router.push(session?.user ? detailsUrl : getLoginUrl(detailsUrl));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Checking session..." : "View Details"}
    </button>
  );
}
