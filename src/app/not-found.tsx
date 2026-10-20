import Link from "next/link";
import { Compass, Home, Map } from "lucide-react";
import { getI18n } from "@/server/i18n";

export default async function NotFound() {
  const { dict } = await getI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 via-white to-white px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-700 text-white shadow-lg shadow-brand-900/20">
          <Compass className="h-8 w-8" aria-hidden />
        </span>
        <p className="mt-6 font-display text-7xl font-semibold text-brand-200">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-900">
          {dict.notFound.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {dict.notFound.desc}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <Home className="h-4 w-4" aria-hidden />
            {dict.notFound.home}
          </Link>
          <Link
            href="/destinasi"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <Map className="h-4 w-4" aria-hidden />
            {dict.notFound.explore}
          </Link>
        </div>
      </div>
    </div>
  );
}
