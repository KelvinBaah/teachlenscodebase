"use client";

import { useState } from "react";

const showcaseCards = [
  {
    title: "Class Summary Assessments",
    eyebrow: "Assess",
    body: "Every assessment type now feeds one shared eight-field form, so professors can log class-level evidence in under 30 seconds.",
    accent: "bg-[rgba(31,92,74,0.12)] text-[var(--pine)]",
  },
  {
    title: "Transparent Recommendation Logic",
    eyebrow: "Recommend",
    body: "Signals like score, confidence, participation, and observation drive a rule-based matrix that stays explainable and editable.",
    accent: "bg-[rgba(182,111,63,0.14)] text-[var(--clay)]",
  },
  {
    title: "Weekly Teaching Tracker",
    eyebrow: "Track",
    body: "Log the method you used next, compare it against the recommendation, and keep a longitudinal trail of what happened over time.",
    accent: "bg-[rgba(230,197,109,0.2)] text-[#7f6322]",
  },
];

export function LandingShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = showcaseCards[activeIndex];

  return (
    <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-3">
        {showcaseCards.map((card, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={card.title}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`w-full rounded-[28px] border px-5 py-5 text-left transition duration-300 ${
                isActive
                  ? "border-[rgba(31,92,74,0.18)] bg-[rgba(255,255,255,0.88)] shadow-[0_20px_50px_rgba(23,33,43,0.08)]"
                  : "border-[rgba(23,33,43,0.08)] bg-[rgba(255,255,255,0.58)] hover:border-[rgba(23,33,43,0.16)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">{card.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#17212b]">{card.title}</h3>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${card.accent}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[32px] bg-[#17212b] p-7 text-white shadow-[0_24px_80px_rgba(23,33,43,0.18)]">
        <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-[rgba(230,197,109,0.16)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[rgba(31,92,74,0.24)] blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            {activeCard.eyebrow}
          </p>
          <h3 className="mt-4 text-4xl font-semibold">{activeCard.title}</h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/74">{activeCard.body}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Speed</p>
              <p className="mt-3 text-2xl font-semibold">Fast</p>
              <p className="mt-2 text-sm text-white/65">One form across all assessment types.</p>
            </div>
            <div className="rounded-[24px] bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Signals</p>
              <p className="mt-3 text-2xl font-semibold">4+</p>
              <p className="mt-2 text-sm text-white/65">Score, confidence, participation, and observation.</p>
            </div>
            <div className="rounded-[24px] bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Privacy</p>
              <p className="mt-3 text-2xl font-semibold">PII-free</p>
              <p className="mt-2 text-sm text-white/65">Teacher-facing and class-level only.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
