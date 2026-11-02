import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLoginUrl } from "@/lib/auth-redirect";

export async function requireUser(returnTo) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(getLoginUrl(returnTo));
  }

  return session.user;
}
