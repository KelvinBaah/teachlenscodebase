"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getSupabaseConfig } from "@/lib/supabase/config";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  nextPath?: string;
};

const formCopy = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to continue reviewing your classes and weekly insights.",
    submitLabel: "Sign In",
    alternateLabel: "Need an account?",
    alternateHref: "/sign-up",
    alternateAction: "Create one",
  },
  "sign-up": {
    title: "Create your teacher account",
    subtitle: "Start with a simple teacher-only account for the TeachLens MVP.",
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

      router.push(nextPath);
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
    <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_70px_rgba(16,33,43,0.10)]">
      <div className="space-y-3">
        <p className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pine">
          Teacher Access
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{copy.title}</h1>
        <p className="text-sm leading-6 text-slate-600">{copy.subtitle}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
            placeholder="teacher@example.edu"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
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
          className="w-full rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#184a3c] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Working..." : copy.submitLabel}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-600">
        <p>{copy.alternateLabel}</p>
        <Link className="font-semibold text-pine hover:text-[#184a3c]" href={copy.alternateHref}>
          {copy.alternateAction}
        </Link>
      </div>

      <p className="mt-6 text-xs leading-5 text-slate-500">
        TeachLens auth is teacher-only for the MVP and should never include student-identifiable
        records.
      </p>
    </div>
  );
}
