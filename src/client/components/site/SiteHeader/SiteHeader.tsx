"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/client/components/site/Logo";
import LanguageSwitcher from "@/client/components/site/LanguageSwitcher";
import { useI18n } from "@/client/i18n";
import { cn } from "@/shared/utils";

export default function SiteHeader() {
  const pathname = usePathname();
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/", label: dict.nav.home },
    { href: "/destinasi", label: dict.nav.destinations },
    { href: "/rute", label: dict.nav.routes },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Logo subtitle={dict.common.virtualTour} />
        </div>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label={dict.nav.mainLabel}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brand-50 text-brand-800"
                  : "text-ink-600 hover:bg-slate-100 hover:text-ink-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-ink-700 transition hover:bg-slate-100 md:hidden"
            aria-expanded={open}
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
            aria-label={dict.nav.mobileLabel}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-700 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
