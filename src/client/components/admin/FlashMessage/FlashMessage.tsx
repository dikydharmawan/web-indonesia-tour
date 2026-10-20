import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function FlashMessage({
  error,
  saved,
}: {
  error?: string;
  saved?: string;
}) {
  if (!error && !saved) return null;

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{saved}</p>
    </div>
  );
}
