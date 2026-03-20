"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { dashboardNavGroups } from "@/data/dashboard-config";

import { ThemeSwitch } from "./theme-switch";

type DashboardShellProps = {
  userEmail: string;
  primaryAssessmentHref: string;
  children: React.ReactNode;
};

function getInitials(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function DashboardShell({
  userEmail,
  primaryAssessmentHref,
  children,
}: DashboardShellProps) {
  const pathname = usePathname() ?? "";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initials = useMemo(() => getInitials(userEmail), [userEmail]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-sm font-semibold text-white shadow-sm">
            TL
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">TeachLens</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Instructor dashboard</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 lg:hidden dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          aria-label="Close navigation"
        >
          Close
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {dashboardNavGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              {group.label}
            </p>
            <div className="mt-3 space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={`${group.label}-${item.label}`}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-200">
            {initials || "TL"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {userEmail}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Teacher-only workspace
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Use class-level summary data only. Do not enter student-identifiable information.
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="lg:hidden">
        {isSidebarOpen ? (
          <div className="fixed inset-0 z-50 flex">
            <button
              type="button"
              className="w-full bg-neutral-950/50"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="absolute left-0 top-0 h-full w-72 border-r border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
              {sidebarContent}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-neutral-200 bg-white px-5 py-6 lg:block dark:border-neutral-800 dark:bg-neutral-950">
        {sidebarContent}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-neutral-50/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
          <div className="app-shell py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 shadow-sm transition hover:border-primary-300 hover:text-primary-700 lg:hidden dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
                >
                  Menu
                </button>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor="dashboard-search">
                    Search dashboard
                  </label>
                  <input
                    id="dashboard-search"
                    type="search"
                    placeholder="Search classes, concepts, and strategies"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <ThemeSwitch />
                <Link
                  href="/dashboard/classes/new"
                  className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  New class
                </Link>
                <Link
                  href={primaryAssessmentHref}
                  className="inline-flex items-center rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm font-semibold text-secondary-700 transition hover:border-secondary-300 hover:bg-secondary-100 dark:border-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-200 dark:hover:border-secondary-700 dark:hover:bg-secondary-900/50"
                >
                  Add assessment
                </Link>
                <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                    {initials || "TL"}
                  </span>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Instructor
                    </p>
                    <p className="max-w-[12rem] truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="app-shell">{children}</div>
      </div>
    </div>
  );
}
