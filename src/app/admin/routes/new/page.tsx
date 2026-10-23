import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RouteForm from "@/client/components/admin/RouteForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { listDestinations } from "@/server/data/destinations";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.newRoute };
}

type SearchParams = Promise<{ error?: string }>;

export default async function NewRoutePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const t = dict.admin;
  const { error } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const destinations = await listDestinations();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/routes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t.form.backToRoutes}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
          {t.form.newRouteTitle}
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          {t.form.newRouteDesc}
        </p>
      </div>

      <FlashMessage error={errorMessage ?? undefined} />

      <RouteForm destinations={destinations} cancelHref="/admin/routes" />
    </div>
  );
}
