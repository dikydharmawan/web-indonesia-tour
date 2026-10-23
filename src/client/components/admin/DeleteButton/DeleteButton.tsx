"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { useI18n } from "@/client/i18n";
import { cn } from "@/shared/utils";

export default function DeleteButton({
  label,
  confirmText,
  className,
}: {
  label?: string;
  confirmText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const { dict } = useI18n();
  const text = label ?? dict.admin.delete.label;
  const confirm = confirmText ?? dict.admin.delete.confirm;

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {text}
    </button>
  );
}
