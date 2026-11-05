import { UserRound } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { requireUser } from "@/lib/require-user";

function formatMembershipDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function MyProfilePage() {
  const user = await requireUser("/my-profile");
  const name = user.name || "BookNook member";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <section
        aria-label="My profile"
        className="w-full max-w-md rounded-2xl border border-brand-plum/20 bg-card p-8 text-center shadow-2xl shadow-black/20 sm:p-10"
      >
        <Avatar className="mx-auto size-28 border border-brand-plum/20 ring-4 ring-brand-plum/10">
          <AvatarImage src={user.image || undefined} alt={name} />
          <AvatarFallback className="bg-brand-paper font-serif text-3xl font-semibold text-brand-ink">
            {initial || <UserRound aria-hidden="true" size={34} />}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-6 font-serif text-2xl font-bold tracking-tight text-slate-900">
          {name}
        </h1>
        <p className="mt-1 break-all text-sm text-slate-600">{user.email}</p>
        <p className="mt-4 text-xs text-slate-500">
          Member since {formatMembershipDate(user.createdAt)}
        </p>
      </section>
    </main>
  );
}
