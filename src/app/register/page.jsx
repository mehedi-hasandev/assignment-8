"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const inputClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20";

function getPasswordError(password) {
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordError("");
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const validationError = getPasswordError(password);

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        image: image || undefined,
        password,
      });

      if (error) {
        setFormError(error.message);
        toast.error(error.message);
        return;
      }

      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not create your account. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setFormError("");
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
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
            Join BookNook
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Build your reading community, one book at a time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="register-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="register-image" className="text-sm font-medium">
              Photo URL
            </label>
            <input
              id="register-image"
              name="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="register-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              aria-invalid={Boolean(passwordError)}
              aria-describedby={
                passwordError ? "register-password-error" : "password-hint"
              }
              onChange={() => setPasswordError("")}
              className={inputClassName}
            />
            {passwordError ? (
              <p
                id="register-password-error"
                role="alert"
                className="mt-2 text-sm text-red-300"
              >
                {passwordError}
              </p>
            ) : (
              <p id="password-hint" className="mt-2 text-xs text-white/45">
                Use at least 6 characters, including uppercase and lowercase
                letters.
              </p>
            )}
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
            {isSubmitting ? "Creating account..." : "Register"}
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-300 transition-colors hover:text-emerald-200"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
