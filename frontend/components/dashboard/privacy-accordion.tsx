"use client";

import { useState } from "react";

type PrivacyAccordionProps = {
  rawUploadRetentionDays: string;
  detailRecordRetentionDays: string;
};

const sections = [
  {
    id: "data",
    title: "What data belongs in TeachLens",
    body: "Only class-level summary information belongs here: average score, average confidence, participation rate, current teaching method, and a short teacher observation. Student names, IDs, and personal records do not belong in the system.",
  },
  {
    id: "retention",
    title: "How retention works",
    body: "Detailed records can expire and be cleaned later without wiping out every historical signal. The app is designed to preserve lightweight trend context while reducing unnecessary detail over time.",
  },
  {
    id: "ai",
    title: "How AI is used",
    body: "AI is optional and only explains existing analysis and rule-based recommendations. It does not choose teaching methods, and requests are sent with store=false.",
  },
];

export function PrivacyAccordion({
  rawUploadRetentionDays,
  detailRecordRetentionDays,
}: PrivacyAccordionProps) {
  const [openId, setOpenId] = useState("data");

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <article
            key={section.id}
            className="rounded-[26px] border border-[rgba(23,33,43,0.08)] bg-[rgba(255,255,255,0.72)] p-5"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? "" : section.id)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div>
                <p className="text-lg font-semibold text-[#17212b]">{section.title}</p>
                {section.id === "retention" ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--clay)]">
                    Raw uploads: {rawUploadRetentionDays} days | detailed records:{" "}
                    {detailRecordRetentionDays} days
                  </p>
                ) : null}
              </div>
              <span className="rounded-full bg-[rgba(31,92,74,0.1)] px-3 py-1 text-sm font-semibold text-[var(--pine)]">
                {isOpen ? "Hide" : "Show"}
              </span>
            </button>

            {isOpen ? (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{section.body}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
