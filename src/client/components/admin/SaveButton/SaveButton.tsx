"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { useI18n } from "@/client/i18n";

export default function SaveButton({ label }: { label?: string }) {
  const { pending } = useFormStatus();
  const { dict } = useI18n();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Save className="h-4 w-4" aria-hidden />
      )}
      {pending ? dict.admin.save.saving : (label ?? dict.admin.save.save)}
    </button>
  );
}
