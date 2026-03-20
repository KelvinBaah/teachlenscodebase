"use client";

import Link from "next/link";
import { useState } from "react";

type OverviewPlaybookProps = {
  classCount: number;
};

const views = [
  {
    id: "assess",
    label: "Assess",
    title: "Capture one clean class summary",
    body: "Use the same eight fields every time so the backend gets structured, comparable evidence across quiz, assignment, diagnostic check, and exit ticket workflows.",
    actionHref: "/dashboard/classes",
    actionLabel: "Open classes",
  },
  {
    id: "recommend",
    label: "Recommend",
    title: "Interpret signals without black-box logic",
    body: "Average score, confidence, participation, observation, and assessment type feed the current rule-based recommendation engine.",
    actionHref: "/dashboard/help",
    actionLabel: "Review privacy and workflow",
  },
  {
    id: "track",
    label: "Track",
    title: "Keep a visible record of what you taught next",
    body: "Method logging stays tied to the assessment timeline so weekly changes remain easy to review and easy to explain later.",
    actionHref: "/dashboard/classes",
    actionLabel: "Open tracker flow",
  },
];

export function OverviewPlaybook({ classCount }: OverviewPlaybookProps) {
  const [activeId, setActiveId] = useState("assess");
  const activeView = views.find((view) => view.id === activeId) ?? views[0];

  return (
    <section className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
      <article className="paper-card rounded-[30px] p-7">
        <p className="section-kicker">Workspace Pulse</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-[rgba(247,242,232,0.86)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--clay)]">Classes</p>
            <p className="mt-3 text-4xl font-semibold text-[#17212b]">{classCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              active class profiles available for summary assessments
            </p>
          </div>
          <div className="rounded-[24px] bg-[rgba(220,233,224,0.58)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--pine)]">Flow</p>
            <p className="mt-3 text-2xl font-semibold text-[#17212b]">Assess -&gt; Recommend -&gt; Track</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              the frontend mirrors the current backend flow directly
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {views.map((view) => {
            const isActive = activeId === view.id;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveId(view.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--pine)] text-white"
                    : "border border-[rgba(23,33,43,0.12)] text-[#17212b] hover:border-[rgba(23,33,43,0.24)]"
                }`}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </article>

      <article className="hero-card rounded-[30px] p-7">
        <p className="section-kicker">{activeView.label}</p>
        <h3 className="mt-3 text-4xl font-semibold text-[#17212b]">{activeView.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{activeView.body}</p>

        <div className="mt-8 rounded-[26px] bg-[rgba(255,255,255,0.75)] p-5 shadow-[0_16px_40px_rgba(23,33,43,0.06)]">
          <p className="text-sm font-semibold text-[#17212b]">Why this matters for the MVP</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            The interface is intentionally shaped around the backend constraints: class-level
            summary data, predictable recommendation logic, teacher-facing language, and
            retention-friendly records.
          </p>
          <Link
            href={activeView.actionHref}
            className="mt-5 inline-flex rounded-full bg-[var(--pine)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--pine-deep)]"
          >
            {activeView.actionLabel}
          </Link>
        </div>
      </article>
    </section>
  );
}
