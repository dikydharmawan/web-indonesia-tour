import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, Orbit } from "lucide-react";
import LoginForm from "@/client/components/auth/LoginForm";
import Logo from "@/client/components/site/Logo";
import { I18nProvider } from "@/client/i18n";
import { getI18n } from "@/server/i18n";
import { LOCALE_META } from "@/shared/i18n-config";

type SearchParams = Promise<{ next?: string; error?: string }>;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.login.metaTitle,
    description: dict.login.metaDesc,
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const meta = LOCALE_META[locale];
  const { next, error } = await searchParams;
  const target =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <I18nProvider locale={locale}>
      <div dir={meta.dir} lang={meta.htmlLang} className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/covers/borobudur.jpg"
            alt={dict.login.heroAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/20" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Logo variant="light" subtitle={dict.common.virtualTour} />
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Orbit className="h-3.5 w-3.5" aria-hidden />
                {dict.login.badge}
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white">
                {dict.login.heroTitle}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {dict.login.heroDesc}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Jelajah Nusantara
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <Logo subtitle={dict.common.virtualTour} />
            </div>

            <div className="mt-8 lg:mt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {dict.login.restricted}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900">
                {dict.login.formTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {dict.login.formDesc}
              </p>
            </div>

            <div className="mt-8">
              <LoginForm next={target} error={error} />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-brand-700"
              >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                {dict.login.backToSite}
              </Link>
              <Link
                href="/destinasi"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline"
              >
                <Compass className="h-3.5 w-3.5" aria-hidden />
                {dict.login.explore}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}
