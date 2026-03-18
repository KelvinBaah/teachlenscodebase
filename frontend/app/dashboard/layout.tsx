import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/sign-in");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link className="inline-flex text-sm font-semibold text-pine hover:text-[#184a3c]" href="/">
              TeachLens
            </Link>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
                Protected Dashboard
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                Welcome, {user.email}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-mist px-4 py-2 text-sm text-pine">
              Authenticated teacher session
            </div>
            <SignOutButton />
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
