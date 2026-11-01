"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getSafeReturnTo } from "@/lib/auth-redirect";

const inputClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const returnTo = getSafeReturnTo(
      new URLSearchParams(window.location.search).get("callbackUrl"),
    );

    try {
      const { error } = await authClient.signIn.email({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });

      if (error) {
        setFormError(error.message);
        toast.error(error.message);
        return;
      }

      toast.success("You are logged in.");
      router.push(returnTo);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not log in. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setFormError("");
    setIsSubmitting(true);
    const returnTo = getSafeReturnTo(
      new URLSearchParams(window.location.search).get("callbackUrl"),
    );

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: returnTo,
      });

      if (error) {
        setFormError(error.message);
        toast.error(error.message);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not continue with Google. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#0b1510] px-4 py-10 text-white sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111d17] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Welcome back
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Log in to BookNook
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Sign in to continue to your reading community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClassName}
            />
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-950/30 px-3 py-2 text-sm text-red-200"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />
            )}
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-white/35">
          <span className="h-px flex-1 bg-white/10" />
          <span>or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285f4]"
          >
            G
          </span>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-white/55">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
