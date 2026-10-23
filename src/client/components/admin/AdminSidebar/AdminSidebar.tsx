"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Palette,
  Route as RouteIcon,
  X,
} from "lucide-react";
import Logo from "@/client/components/site/Logo";
import { useI18n } from "@/client/i18n";
import { logout } from "@/server/actions";
import { cn } from "@/shared/utils";

export default function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);

  const nav = [
    {
      href: "/admin",
      label: dict.admin.sidebar.summary,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/destinations",
      label: dict.admin.sidebar.destinations,
      icon: Map,
      exact: false,
    },
    {
      href: "/admin/routes",
      label: dict.admin.sidebar.routes,
      icon: RouteIcon,
      exact: false,
    },
    {
      href: "/admin/settings",
      label: dict.admin.sidebar.appearance,
      icon: Palette,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navLinks = (
    <nav className="space-y-1" aria-label={dict.admin.common.navLabel}>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
            isActive(item.href, item.exact)
              ? "bg-white/10 text-white ring-1 ring-white/15"
              : "text-slate-400 hover:bg-white/5 hover:text-white",
          )}
        >
          <item.icon className="h-4 w-4" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {dict.admin.common.signedInAs}
        </p>
        <p className="mt-0.5 truncate text-xs font-medium text-slate-200">
          {email ?? dict.admin.common.administrator}
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        {dict.admin.common.viewPublicSite}
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {dict.admin.common.logout}
        </button>
      </form>
    </div>
  );

  return (
    <>
      <aside className="hidden border-r border-white/10 bg-ink-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <div>
          <Logo variant="light" href="/admin" compact />
          <p className="mt-1 pl-[52px] text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {dict.admin.common.dashboard}
          </p>
          <div className="mt-8">{navLinks}</div>
        </div>
        <div className="mt-6">{footer}</div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-ink-950 px-4 lg:hidden">
        <Logo variant="light" href="/admin" compact />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white"
          aria-expanded={open}
          aria-label={
            open ? dict.admin.common.closeMenu : dict.admin.common.openMenu
          }
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <div className="sticky top-16 z-30 border-b border-white/10 bg-ink-950 px-4 py-4 lg:hidden">
          {navLinks}
          <div className="mt-4 border-t border-white/10 pt-4">{footer}</div>
        </div>
      )}
    </>
  );
}
