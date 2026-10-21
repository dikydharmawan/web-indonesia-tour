import Link from "next/link";
import { AtSign, Mail, MapPin } from "lucide-react";
import Logo from "@/client/components/site/Logo";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";

export default async function SiteFooter() {
  const { dict } = await getI18n();

  return (
    <footer className="border-t border-slate-800 bg-ink-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <Logo variant="light" />
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            {dict.footer.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" aria-hidden />
              {dict.footer.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-400" aria-hidden />
              halo@jelajahnusantara.id
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {dict.footer.explore}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/destinasi" className="transition hover:text-white">
                {dict.footer.allDestinations}
              </Link>
            </li>
            <li>
              <Link href="/rute" className="transition hover:text-white">
                {dict.footer.routes}
              </Link>
            </li>
            <li>
              <Link
                href="/destinasi?category=Budaya"
                className="transition hover:text-white"
              >
                {dict.footer.cultural}
              </Link>
            </li>
            <li>
              <Link
                href="/destinasi?category=Alam"
                className="transition hover:text-white"
              >
                {dict.footer.nature}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {dict.footer.manage}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/login" className="transition hover:text-white">
                {dict.footer.login}
              </Link>
            </li>
            <li className="inline-flex items-center gap-2 text-slate-400">
              <AtSign className="h-4 w-4" aria-hidden />
              @jelajahnusantara
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {interpolate(dict.footer.copyright, {
              year: new Date().getFullYear(),
            })}
          </p>
          <p>{dict.footer.credits}</p>
        </div>
      </div>
    </footer>
  );
}
