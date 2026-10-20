import { cn } from "@/shared/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "brand" | "amber" | "slate" | "outline" | "dark" | "danger";
  className?: string;
};

const VARIANTS: Record<NonNullable<BadgeProps["variant"]>, string> = {
  brand: "border-brand-200 bg-brand-50 text-brand-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  outline: "border-white/30 bg-white/10 text-white backdrop-blur",
  dark: "border-ink-800 bg-ink-900 text-white",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function Badge({
  children,
  variant = "slate",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
