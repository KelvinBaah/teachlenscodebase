"use client";

import { useEffect, useState } from "react";

const storageKey = "teachlens-theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const resolvedTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemTheme;

    applyTheme(resolvedTheme);
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-primary-300 hover:text-primary-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
      aria-label="Toggle theme"
    >
      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-secondary-500" />
      <span>{mounted && theme === "dark" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
