import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbf8_0%,#edf4ef_100%)] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <section className="max-w-xl space-y-6">
          <Link className="inline-flex text-sm font-semibold text-pine hover:text-[#184a3c]" href="/">
            Back to home
          </Link>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              TeachLens Sign Up
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-ink">
              Create a simple teacher account for the MVP.
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              No student-identifiable data belongs in auth. This account is only for protected
              teacher access to the TeachLens workspace.
            </p>
          </div>
        </section>

        <AuthForm mode="sign-up" />
      </div>
    </main>
  );
}
