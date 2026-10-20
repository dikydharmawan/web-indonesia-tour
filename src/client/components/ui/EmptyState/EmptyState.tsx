import Link from "next/link";
import { Compass, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: LucideIcon;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon: Icon = Compass,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center ${className ?? ""}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-xl font-semibold text-ink-900">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600">
          {description}
        </p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
