"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function SubmitButton({ idleLabel, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
