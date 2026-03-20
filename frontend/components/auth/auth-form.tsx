"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { getSafeAuthRedirectPath } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getSupabaseConfig } from "@/lib/supabase/config";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
};

const formCopy = {
  "sign-in": {
    title: "Return to your teaching workspace",
    subtitle:
      "Sign in to review class summaries, recommendation guidance, and teaching-method history.",
    submitLabel: "Sign In",
    alternateLabel: "Need an account?",
    alternateHref: "/sign-up",
    alternateAction: "Create one",
  },
  "sign-up": {
    title: "Create a teacher account",
    subtitle:
      "Start with a teacher-only account for the TeachLens MVP. This workspace is for class-level summary data only.",
    submitLabel: "Create Account",
    alternateLabel: "Already have an account?",
    alternateHref: "/sign-in",
    alternateAction: "Sign in",
  },
} as const;

export function AuthForm({ mode, nextPath = "/dashboard" }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isConfigured } = getSupabaseConfig();
  const safeNextPath = getSafeAuthRedirectPath(nextPath);

  const copy = formCopy[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isConfigured) {
      setError("Add your Supabase URL and anon key in frontend/.env.local before signing in.");
      return;
    }

    if (password.length < 8) {
      setError("Passwords should be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "sign-up") {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/sign-in`,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setSuccess("Account created. Check your email if confirmation is enabled in Supabase.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.push(safeNextPath);
      router.refresh();
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="paper-card w-full max-w-lg p-8 md:p-10">
      <div className="space-y-3">
        <p className="section-kicker">Teacher Access</p>
        <h1 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          {copy.title}
        </h1>
        <p className="text-sm leading-7 text-neutral-500 dark:text-neutral-400">{copy.subtitle}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="teacher@example.edu"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
            placeholder="At least 8 characters"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Working..." : copy.submitLabel}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <p>{copy.alternateLabel}</p>
        <Link className="font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200" href={copy.alternateHref}>
          {copy.alternateAction}
        </Link>
      </div>

      <div className="mt-8 rounded-3xl bg-neutral-50 p-4 text-xs leading-6 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
        This account is for teachers only. Do not enter student names, student IDs, or other
        student-identifiable information anywhere in TeachLens.
      </div>
    </div>
  );
}
