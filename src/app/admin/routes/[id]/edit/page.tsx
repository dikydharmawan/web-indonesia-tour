import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import RouteForm from "@/client/components/admin/RouteForm";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { listDestinations } from "@/server/data/destinations";
import { getRouteById } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { locale, dict } = await getI18n();
  const route = await getRouteById(id);
  return {
    title: route
      ? `${dict.admin.form.editRouteTitle}: ${localizeText(route.title, locale)}`
      : dict.admin.form.editRouteTitle,
  };
}

export default async function EditRoutePage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { locale, dict } = await getI18n();
  const t = dict.admin;
  const { error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const [route, destinations] = await Promise.all([
    getRouteById(id),
    listDestinations(),
  ]);

  if (!route) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/routes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {t.form.backToRoutes}
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink-900">
            {t.form.editRouteTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {localizeText(route.title, locale)}
          </p>
        </div>
        {route.status === "published" && (
          <Link
            href={`/rute/${route.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {t.form.viewPublicPage}
          </Link>
        )}
      </div>

      <FlashMessage error={errorMessage ?? undefined} saved={savedMessage ?? undefined} />

      <RouteForm
        route={route}
        destinations={destinations}
        cancelHref="/admin/routes"
      />
    </div>
  );
}
