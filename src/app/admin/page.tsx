import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Map,
  Orbit,
  Palette,
  Plus,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import CoverImage from "@/client/components/ui/CoverImage";
import FlashMessage from "@/client/components/admin/FlashMessage";
import { getFilterOptions, listDestinations } from "@/server/data/destinations";
import { listRoutesWithItems } from "@/server/data/routes";
import { getI18n } from "@/server/i18n";
import { localizeText } from "@/shared/content-i18n";
import { interpolate } from "@/shared/i18n-config";
import { formatDate, formatDuration } from "@/shared/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.meta.summary };
}

type SearchParams = Promise<{ error?: string; saved?: string }>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const t = dict.admin;
  const { error, saved } = await searchParams;
  const errorMessage = localizeText(error, locale);
  const savedMessage = localizeText(saved, locale);
  const [destinations, routes, filters] = await Promise.all([
    listDestinations(),
    listRoutesWithItems({ includeDrafts: true }),
    getFilterOptions(),
  ]);

  const published = routes.filter((route) => route.status === "published");
  const drafts = routes.filter((route) => route.status === "draft");
  const withPanorama = destinations.filter((item) => item.panorama_url);

  const recentDestinations = [...destinations]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 5);

  const stats = [
    {
      label: t.dashboard.statDestinations,
      value: destinations.length,
      detail: interpolate(t.dashboard.statDestinationsDetail, {
        count: filters.cities.length,
      }),
      icon: Map,
      accent: "bg-brand-50 text-brand-700",
    },
    {
      label: t.dashboard.statPanoramas,
      value: withPanorama.length,
      detail: interpolate(t.dashboard.statPanoramasDetail, {
        count: destinations.length - withPanorama.length,
      }),
      icon: Orbit,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: t.dashboard.statPublished,
      value: published.length,
      detail: interpolate(t.dashboard.statPublishedDetail, {
        count: drafts.length,
      }),
      icon: RouteIcon,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: t.dashboard.statCategories,
      value: filters.categories.length,
      detail:
        filters.categories
          .map((item) => localizeText(item.value, locale))
          .slice(0, 2)
          .join(", ") || "—",
      icon: Sparkles,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      <FlashMessage error={errorMessage ?? undefined} saved={savedMessage ?? undefined} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {t.dashboard.eyebrow}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink-900">
            {t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {t.dashboard.desc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {t.dashboard.addDestination}
          </Link>
          <Link
            href="/admin/routes/new"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            <RouteIcon className="h-4 w-4" aria-hidden />
            {t.dashboard.createRoute}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
                  {stat.value}
                </p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${stat.accent}`}>
                <stat.icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <p className="mt-2 truncate text-xs text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">
                {t.dashboard.recentTitle}
              </h2>
              <p className="text-xs text-slate-500">{t.dashboard.recentDesc}</p>
            </div>
            <Link
              href="/admin/destinations"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
            >
              {t.common.manage}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {recentDestinations.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              {t.dashboard.noDestinations}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentDestinations.map((destination) => (
                <li key={destination.id}>
                  <Link
                    href={`/admin/destinations/${destination.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                  >
                    <CoverImage
                      src={destination.cover_image}
                      alt={destination.title}
                      className="h-12 w-16 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {localizeText(destination.title, locale)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {[destination.category, destination.city]
                          .filter(Boolean)
                          .map((value) => localizeText(value, locale))
                          .join(" · ") || t.common.noCategory}
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      {destination.panorama_url ? (
                        <Badge variant="brand">
                          <Orbit className="h-3 w-3" aria-hidden />
                          360°
                        </Badge>
                      ) : (
                        <Badge variant="slate">
                          <ImageIcon className="h-3 w-3" aria-hidden />
                          {t.dashboard.without360}
                        </Badge>
                      )}
                    </div>
                    <span className="hidden text-[11px] text-slate-400 md:block">
                      {formatDate(destination.updated_at, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">
                {t.dashboard.routesTitle}
              </h2>
              <p className="text-xs text-slate-500">{t.dashboard.routesDesc}</p>
            </div>
            <Link
              href="/admin/routes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
            >
              {t.common.manage}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {routes.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              {t.dashboard.noRoutes}
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {routes.slice(0, 5).map((route) => (
                <li key={route.id}>
                  <Link
                    href={`/admin/routes/${route.id}/edit`}
                    className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {localizeText(route.title, locale)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {interpolate(t.dashboard.routeMeta, {
                          duration: formatDuration(route.duration_days, locale),
                          count: route.route_items.length,
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={route.status === "published" ? "brand" : "amber"}
                    >
                      {route.status === "published"
                        ? t.common.published
                        : t.common.draft}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/destinations/new"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
            <Plus className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            {t.dashboard.quickAddTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {t.dashboard.quickAddDesc}
          </p>
        </Link>
        <Link
          href="/admin/routes/new"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <RouteIcon className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            {t.dashboard.quickRouteTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {t.dashboard.quickRouteDesc}
          </p>
        </Link>
        <Link
          href="/"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
            <Orbit className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            {t.dashboard.quickSiteTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {t.dashboard.quickSiteDesc}
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className="group rounded-2xl border border-dashed border-slate-300 bg-white p-5 transition hover:border-brand-400 hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
            <Palette className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink-900">
            {t.dashboard.quickThemeTitle}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {t.dashboard.quickThemeDesc}
          </p>
        </Link>
      </div>
    </div>
  );
}
