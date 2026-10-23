import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/shared/utils";

type LogoProps = {
  href?: string;
  variant?: "dark" | "light";
  compact?: boolean;
  subtitle?: string;
  className?: string;
};

export default function Logo({
  href = "/",
  variant = "dark",
  compact = false,
  subtitle = "Virtual Tour & Rute",
  className,
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label="Jelajah Nusantara — beranda"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-900/20 transition-transform duration-300 group-hover:-rotate-6">
        <Compass className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-display text-lg font-semibold tracking-tight",
            variant === "light" ? "text-white" : "text-ink-900",
          )}
        >
          Jelajah Nusantara
        </span>
        {!compact && (
          <span
            className={cn(
              "block text-[11px] font-medium uppercase tracking-[0.22em]",
              variant === "light" ? "text-white/60" : "text-ink-600",
            )}
          >
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
