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
    <main className="flex flex-1 items-center justify-center bg-[#0b1510] px-4 py-12 text-white sm:px-6">
      <section
        aria-label="My profile"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111d17] p-8 text-center shadow-2xl shadow-black/20 sm:p-10"
      >
        <Avatar className="mx-auto size-28 border border-white/10 ring-4 ring-emerald-300/10">
          <AvatarImage src={user.image || undefined} alt={name} />
          <AvatarFallback className="bg-emerald-300/10 font-serif text-3xl font-semibold text-emerald-100">
            {initial || <UserRound aria-hidden="true" size={34} />}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-6 font-serif text-2xl font-bold tracking-tight text-white">
          {name}
        </h1>
        <p className="mt-1 break-all text-sm text-zinc-400">{user.email}</p>
        <p className="mt-4 text-xs text-zinc-500">
          Member since {formatMembershipDate(user.createdAt)}
        </p>
      </section>
    </main>
  );
}
