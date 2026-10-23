import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, SlidersHorizontal } from "lucide-react";
import DestinationSearch from "@/client/components/destinations/DestinationSearch";
import DestinationCard from "@/client/components/destinations/DestinationCard";
import EmptyState from "@/client/components/ui/EmptyState";
import {
  getFilterOptions,
  listDestinations,
} from "@/server/data/destinations";
import { getI18n } from "@/server/i18n";
import { interpolate } from "@/shared/i18n-config";
import { localizeDestination, localizeText } from "@/shared/content-i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.destinations.metaTitle,
    description: dict.destinations.metaDesc,
  };
}

type SearchParams = Promise<{
  q?: string;
  category?: string;
  city?: string;
}>;

function buildHref(
  current: { q?: string; category?: string; city?: string },
  patch: Partial<{ q?: string; category?: string; city?: string }>,
) {
  const params = new URLSearchParams();
  const merged = { ...current, ...patch };
  for (const key of ["q", "category", "city"] as const) {
    const value = merged[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/destinasi?${query}` : "/destinasi";
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale, dict } = await getI18n();
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const city = params.city?.trim() ?? "";

  const [destinationsRaw, filters] = await Promise.all([
    listDestinations({ q, category, city }),
    getFilterOptions(),
  ]);

  const destinations = destinationsRaw.map((item) =>
    localizeDestination(item, locale),
  );

  const activeFilters = [
    q ? { key: "q" as const, label: `“${q}”` } : null,
    category ? { key: "category" as const, label: localizeText(category, locale) ?? category } : null,
    city ? { key: "city" as const, label: localizeText(city, locale) ?? city } : null,
  ].filter(Boolean) as Array<{
    key: "q" | "category" | "city";
    label: string;
  }>;
  const hasFilters = activeFilters.length > 0;

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            {dict.destinations.eyebrow}
          </p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                {dict.destinations.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
                {dict.destinations.desc}
              </p>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600">
              <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600" aria-hidden />
              {interpolate(dict.destinations.found, {
                count: destinations.length,
              })}
            </p>
          </div>

          <div className="mt-8">
            <DestinationSearch
              categories={filters.categories}
              cities={filters.cities}
              defaults={{ q, category, city }}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {hasFilters && (
            <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">
                {dict.destinations.activeFilters}
              </span>
              {activeFilters.map((filter) => (
                <Link
                  key={filter.key}
                  href={buildHref({ q, category, city }, { [filter.key]: undefined })}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 font-semibold text-brand-800 ring-1 ring-brand-200 transition hover:bg-brand-100"
                  title={dict.destinations.removeFilter}
                >
                  {filter.label}
                  <span aria-hidden>×</span>
                </Link>
              ))}
              <Link
                href="/destinasi"
                className="ms-1 font-semibold text-slate-500 underline-offset-2 hover:underline"
              >
                {dict.destinations.resetAll}
              </Link>
            </div>
          )}

          {destinations.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={dict.destinations.emptyTitle}
              description={dict.destinations.emptyDesc}
              actionHref="/destinasi"
              actionLabel={dict.destinations.emptyAction}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  dict={dict}
                  priority={index < 4}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
