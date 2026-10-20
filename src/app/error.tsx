"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useI18n } from "@/client/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink-900">
          {dict.error.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {dict.error.desc}
        </p>
        {error.message && (
          <p className="mt-3 break-words rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {error.message}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {dict.error.retry}
        </button>
      </div>
    </div>
  );
}
